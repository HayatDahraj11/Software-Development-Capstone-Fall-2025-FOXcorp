/**
 * llmClient.js
 *
 * Thin adapter around the language-model provider. The rest of the Lambda
 * talks in OpenAI-shaped chat messages and OpenAI-style function-calling
 * tool definitions; this file translates to/from whatever provider is
 * actually in use. Currently: Google Gemini via @google/generative-ai.
 *
 * Why Gemini?
 *   Original design targeted OpenAI's gpt-4o-mini. Both providers support
 *   function calling so the tool-use loop is identical in shape. We picked
 *   Gemini for billing: Google AI Studio offers a no-credit-card free tier
 *   (15 requests/minute on gemini-2.0-flash), which is plenty for a
 *   capstone demo. OpenAI requires a $5 minimum prepayment. Nothing about
 *   the tool definitions, system prompt, or orchestration loop had to
 *   change. Only this file.
 *
 * External contract (consumed by claraEngine.js):
 *   runChat(messages, tools) => { message, usage, finishReason }
 *
 *   `message` is an OpenAI-shaped assistant turn:
 *     { role: "assistant", content: string|null, tool_calls?: [...] }
 *   `usage` is { prompt_tokens, completion_tokens, total_tokens }
 *   `finishReason` is "tool_calls" when the model requested calls, else "stop"
 *
 * If we ever swap providers again, only this file changes.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

if (!API_KEY) {
  console.warn("llmClient: GEMINI_API_KEY not set. Lambda will fail.");
}

let _client = null;
function getClient() {
  if (!_client) _client = new GoogleGenerativeAI(API_KEY);
  return _client;
}

// Schema translation. Gemini's Schema is a subset of JSON Schema. It silently
// errors on a few keywords we happen to use (minimum/maximum for tool arg
// bounds). Strip them here so tools.js can stay a plain OpenAI-style definition.

const GEMINI_UNSUPPORTED_KEYWORDS = new Set([
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minLength",
  "maxLength",
  "pattern",
  "format",
  "multipleOf",
  "examples",
  "default",
  "$schema",
  "$id",
]);

function sanitizeSchema(schema) {
  if (!schema || typeof schema !== "object") return schema;
  if (Array.isArray(schema)) return schema.map(sanitizeSchema);
  const out = {};
  for (const [k, v] of Object.entries(schema)) {
    if (GEMINI_UNSUPPORTED_KEYWORDS.has(k)) continue;
    if (k === "properties" && v && typeof v === "object") {
      out.properties = {};
      for (const [pk, pv] of Object.entries(v)) {
        out.properties[pk] = sanitizeSchema(pv);
      }
    } else if (k === "items") {
      out.items = sanitizeSchema(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function openAIToolsToGemini(openaiTools) {
  return [
    {
      functionDeclarations: openaiTools.map((t) => ({
        name: t.function.name,
        description: t.function.description,
        parameters: sanitizeSchema(t.function.parameters),
      })),
    },
  ];
}

// Message translation.
// OpenAI roles:  system | user | assistant | tool
// Gemini roles:  (systemInstruction, top-level) | user | model
//
// Translation:
//   system      -> systemInstruction (lifted out of `contents`)
//   user        -> { role: "user",  parts: [{text}] }
//   assistant   -> { role: "model", parts: [{text} | {functionCall}...] }
//   tool        -> { role: "user",  parts: [{functionResponse}...] }
//
// Consecutive tool results are grouped into a single user turn so the
// functionResponse parts match the preceding model turn's functionCall
// parts by position.

function openAIMessagesToGemini(messages) {
  let systemInstruction = null;
  const contents = [];
  const toolCallIdToName = {};
  let pendingToolResponseParts = [];

  const flushToolResponses = () => {
    if (pendingToolResponseParts.length > 0) {
      contents.push({ role: "user", parts: pendingToolResponseParts });
      pendingToolResponseParts = [];
    }
  };

  for (const m of messages) {
    if (m.role === "system") {
      systemInstruction = m.content;
      continue;
    }

    if (m.role !== "tool") flushToolResponses();

    if (m.role === "user") {
      contents.push({
        role: "user",
        parts: [{ text: String(m.content ?? "") }],
      });
    } else if (m.role === "assistant") {
      const hasToolCalls =
        Array.isArray(m.tool_calls) && m.tool_calls.length > 0;
      if (hasToolCalls) {
        const parts = [];
        if (m.content) parts.push({ text: String(m.content) });
        for (const tc of m.tool_calls) {
          toolCallIdToName[tc.id] = tc.function.name;
          let args = {};
          try {
            args = JSON.parse(tc.function.arguments || "{}");
          } catch {
            args = {};
          }
          parts.push({ functionCall: { name: tc.function.name, args } });
        }
        contents.push({ role: "model", parts });
      } else if (m.content) {
        contents.push({
          role: "model",
          parts: [{ text: String(m.content) }],
        });
      }
    } else if (m.role === "tool") {
      const name =
        m.name || toolCallIdToName[m.tool_call_id] || "unknown_tool";
      let response;
      try {
        const parsed = JSON.parse(m.content);
        response =
          parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed
            : { result: parsed };
      } catch {
        response = { result: m.content };
      }
      pendingToolResponseParts.push({
        functionResponse: { name, response },
      });
    }
  }
  flushToolResponses();

  // Gemini requires the first content to be a user turn. If the history
  // somehow starts with a model turn (e.g. Clara spoke first), prepend a
  // minimal user priming turn so the API accepts the request.
  if (contents.length > 0 && contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "(continue)" }] });
  }

  return { systemInstruction, contents };
}

// Response translation.

function geminiResponseToOpenAI(geminiResponse) {
  const candidate = geminiResponse?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];

  let text = "";
  const functionCalls = [];
  for (const part of parts) {
    if (part.functionCall) functionCalls.push(part.functionCall);
    else if (typeof part.text === "string") text += part.text;
  }

  const message = { role: "assistant", content: text || null };
  if (functionCalls.length > 0) {
    message.tool_calls = functionCalls.map((fc, i) => ({
      // Gemini doesn't issue tool-call IDs; fabricate one for claraEngine's
      // tool_call_id bookkeeping.
      id: `call_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`,
      type: "function",
      function: {
        name: fc.name,
        arguments: JSON.stringify(fc.args ?? {}),
      },
    }));
  }

  const usageMeta = geminiResponse?.usageMetadata || {};
  const usage = {
    prompt_tokens: usageMeta.promptTokenCount || 0,
    completion_tokens: usageMeta.candidatesTokenCount || 0,
    total_tokens:
      usageMeta.totalTokenCount ||
      (usageMeta.promptTokenCount || 0) +
        (usageMeta.candidatesTokenCount || 0),
  };

  const finishReason = functionCalls.length > 0 ? "tool_calls" : "stop";

  return { message, usage, finishReason };
}

// Public API.

/**
 * Run a single turn of chat with the model.
 *
 * @param {Array<object>} messages - OpenAI-shaped chat history
 * @param {Array<object>} tools - OpenAI function-calling tool definitions
 * @returns {Promise<{message: object, usage: object, finishReason: string}>}
 */
async function runChat(messages, tools) {
  const client = getClient();
  const { systemInstruction, contents } = openAIMessagesToGemini(messages);
  const geminiTools = openAIToolsToGemini(tools);

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction,
    tools: geminiTools,
    generationConfig: {
      // Low temperature keeps factual answers about attendance and
      // grades consistent, not creative prose.
      temperature: 0.3,
      // Bound so a runaway generation can't eat budget.
      maxOutputTokens: 800,
    },
  });

  const result = await model.generateContent({ contents });
  return geminiResponseToOpenAI(result.response);
}

module.exports = { runChat, MODEL };
