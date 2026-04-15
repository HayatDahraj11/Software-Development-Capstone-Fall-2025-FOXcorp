/**
 * claraEngine.js
 *
 * The brain of Clara. Given a parent id, a conversation id, and the
 * freshly-sent message from the parent, this module:
 *
 *   1. Builds the session context (parent + their students + classes).
 *   2. Loads the last N messages from the conversation (short-term memory).
 *   3. Runs a tool-use loop with OpenAI:
 *        a. send messages + tools to the model
 *        b. if the model asks for tool calls, execute them, append tool
 *           results, loop back to (a)
 *        c. if the model produces a plain answer, break and post it.
 *   4. Writes Clara's reply back to the Conversation as a Message so it
 *      appears in the app the same way any teacher reply would.
 *
 * Why this shape:
 *   - Storing Clara's reply as a normal Message means the existing
 *     messaging UI, subscriptions, and read-state logic all "just work".
 *     Clara is not a special surface, she's a participant.
 *   - Short-term memory is bounded to MAX_HISTORY to keep token cost
 *     predictable. Long conversations naturally summarize themselves
 *     as old turns fall out of the window.
 *   - The tool-use loop is bounded to MAX_TOOL_ROUNDS as a safety net
 *     against a confused model looping forever and burning budget.
 */

const { buildContext } = require("./contextBuilder");
const { buildSystemPrompt } = require("./prompt");
const { runChat } = require("./llmClient");
const { TOOL_DEFINITIONS, executeTool } = require("./tools");
const { gql } = require("./graphqlClient");

// How many of the most recent messages to replay into the prompt.
// 12 gives Clara ~6 back-and-forth turns of short-term memory while
// keeping token usage bounded.
const MAX_HISTORY = 12;

// Hard ceiling on tool-use iterations. Every real query Clara needs to
// answer can be solved in 1-2 rounds; 5 is generous headroom.
const MAX_TOOL_ROUNDS = 5;

// GraphQL ops (inlined to keep Lambda self-contained).

const MESSAGES_BY_CONVO = /* GraphQL */ `
  query MessagesByConvo($conversationId: ID!, $limit: Int) {
    messagesByConversationIdAndCreatedAt(
      conversationId: $conversationId
      sortDirection: DESC
      limit: $limit
    ) {
      items {
        id
        senderId
        senderType
        senderName
        body
        createdAt
      }
    }
  }
`;

const CREATE_MESSAGE = /* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      conversationId
      senderId
      senderType
      senderName
      body
      createdAt
    }
  }
`;

const UPDATE_CONVERSATION = /* GraphQL */ `
  mutation UpdateConversation($input: UpdateConversationInput!) {
    updateConversation(input: $input) {
      id
      lastMessageText
      lastMessageAt
    }
  }
`;

// Clara's identity in the system. The seed script (scripts/seed-clara.ts)
// creates a Teacher record with this id so conversations can reference
// Clara as a participant without special-casing the schema.
const CLARA_SENDER_ID = process.env.CLARA_SENDER_ID || "clara-ai-bot";
const CLARA_SENDER_NAME = "Clara";

// Helpers.

/**
 * Convert our Message rows into the OpenAI chat format.
 * Parent messages become `user`, Clara's prior replies become `assistant`.
 */
function historyToOpenAI(messages) {
  // messages are DESC from GSI; reverse so oldest is first
  return messages
    .slice()
    .reverse()
    .map((m) => {
      const isClara =
        m.senderId === CLARA_SENDER_ID || m.senderName === CLARA_SENDER_NAME;
      return {
        role: isClara ? "assistant" : "user",
        content: m.body,
      };
    });
}

/**
 * Write Clara's reply back into the conversation so the app sees it
 * via the normal messaging flow (live subscriptions already handle
 * rendering, no special UI needed).
 */
async function postClaraReply({ conversationId, body }) {
  const now = new Date().toISOString();

  // Create the message row
  const msgResult = await gql(CREATE_MESSAGE, {
    input: {
      conversationId,
      senderId: CLARA_SENDER_ID,
      senderType: "TEACHER", // schema only has PARENT/TEACHER; Clara acts as teacher-side
      senderName: CLARA_SENDER_NAME,
      body,
      createdAt: now,
    },
  });

  // Update the conversation preview so the inbox shows Clara's last reply
  // (fire-and-forget: if this fails the message still posted)
  gql(UPDATE_CONVERSATION, {
    input: {
      id: conversationId,
      lastMessageText: body,
      lastMessageAt: now,
    },
  }).catch((err) =>
    console.warn("claraEngine: conversation preview update failed:", err)
  );

  return msgResult?.createMessage;
}

// Main entry.

/**
 * Process an incoming parent message through Clara and post a reply.
 *
 * @param {object} input
 * @param {string} input.conversationId
 * @param {string} input.parentId
 * @param {string} input.userMessage  - The parent's latest message text
 * @returns {Promise<{ replyText: string, toolCallsMade: number, usage: object }>}
 */
async function handleParentMessage({ conversationId, parentId, userMessage }) {
  const startedAt = Date.now();

  // 1. Build context (who is this parent, which students can they ask about)
  const context = await buildContext(parentId);

  // 2. Pull short-term memory (recent conversation turns)
  const historyData = await gql(MESSAGES_BY_CONVO, {
    conversationId,
    limit: MAX_HISTORY,
  });
  const history = historyData?.messagesByConversationIdAndCreatedAt?.items ?? [];

  // 3. Assemble the message list for OpenAI.
  //    The latest parent message is already in `history` (it was written
  //    by the client before this Lambda fired), so we do NOT append it a
  //    second time, that would duplicate it in the prompt.
  const messages = [
    { role: "system", content: buildSystemPrompt(context) },
    ...historyToOpenAI(history),
  ];

  // 4. Tool-use loop
  let toolCallsMade = 0;
  let totalUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  let finalText = "";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const { message, usage, finishReason } = await runChat(
      messages,
      TOOL_DEFINITIONS
    );

    // Accumulate token usage for logging/telemetry
    if (usage) {
      totalUsage.prompt_tokens += usage.prompt_tokens || 0;
      totalUsage.completion_tokens += usage.completion_tokens || 0;
      totalUsage.total_tokens += usage.total_tokens || 0;
    }

    // Case A: model produced a plain answer → we're done
    if (!message.tool_calls || message.tool_calls.length === 0) {
      finalText =
        message.content?.trim() ||
        "I'm sorry, I don't have an answer for that right now.";
      break;
    }

    // Case B: model requested tool call(s). Execute them in parallel.
    messages.push(message); // preserve the assistant's tool-call turn

    const toolResults = await Promise.all(
      message.tool_calls.map(async (tc) => {
        toolCallsMade += 1;
        let args = {};
        try {
          args = JSON.parse(tc.function.arguments || "{}");
        } catch (e) {
          args = {};
        }
        const result = await executeTool(tc.function.name, args, context);
        return {
          tool_call_id: tc.id,
          role: "tool",
          name: tc.function.name,
          content: JSON.stringify(result),
        };
      })
    );
    messages.push(...toolResults);

    // If finishReason wasn't "tool_calls" we're in a weird state; bail
    if (finishReason !== "tool_calls") {
      finalText =
        message.content?.trim() ||
        "I looked into that but couldn't compose an answer. Try rephrasing?";
      break;
    }
  }

  if (!finalText) {
    finalText =
      "I had trouble finishing that request. Could you ask again in a simpler way?";
  }

  // 5. Post Clara's reply back as a Message in the conversation
  const posted = await postClaraReply({
    conversationId,
    body: finalText,
  });

  const elapsed = Date.now() - startedAt;
  console.log(
    `clara: parent=${parentId} convo=${conversationId} tools=${toolCallsMade} tokens=${totalUsage.total_tokens} elapsed=${elapsed}ms`
  );

  return {
    replyText: finalText,
    messageId: posted?.id,
    toolCallsMade,
    usage: totalUsage,
    elapsedMs: elapsed,
  };
}

module.exports = { handleParentMessage, CLARA_SENDER_ID, CLARA_SENDER_NAME };
