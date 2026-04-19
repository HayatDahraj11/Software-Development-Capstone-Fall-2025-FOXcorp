/**
 * index.js, Lambda handler for Clara AI Agent
 *
 * Triggered by API Gateway when the mobile app posts a parent message to
 * a conversation whose teacherId === CLARA_SENDER_ID. The flow is:
 *
 *   Mobile app creates Message row in DynamoDB (via AppSync mutation)
 *                ↓
 *   Mobile app immediately calls this Lambda via HTTPS POST
 *                ↓
 *   Lambda runs Clara tool-use loop (3-8s typical)
 *                ↓
 *   Lambda writes Clara's reply as another Message row
 *                ↓
 *   Mobile app's onCreateMessage subscription picks it up → renders
 *
 * IMPORTANT, Lambda lifetime:
 *   AWS Lambda freezes the execution environment the moment the handler
 *   returns. Any work not awaited by the time we return is paused and
 *   typically never resumes. Therefore we AWAIT the full Clara pipeline
 *   before responding. API Gateway permits up to 29s response time,
 *   which is comfortably above our typical 3-8s end-to-end.
 *
 *   (Earlier plan drafts had an "await + fire-and-forget" pattern that
 *    mixed those metaphors; that was a bug, we do not ship it.)
 */

const { handleParentMessage } = require("./claraEngine");

// CORS, permissive for now since this is a mobile app calling from
// arbitrary device IPs. If you add a web surface, tighten this.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  // Parse body, API Gateway gives us a string; local testing gives an object
  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    return respond(400, { error: "Invalid JSON body" });
  }

  const { conversationId, parentId, userMessage } = body || {};

  if (!conversationId || !parentId || !userMessage) {
    return respond(400, {
      error:
        "Missing required fields: conversationId, parentId, userMessage all required.",
    });
  }

  try {
    const result = await handleParentMessage({
      conversationId,
      parentId,
      userMessage,
    });

    return respond(200, {
      ok: true,
      reply: result.replyText,
      messageId: result.messageId,
      toolCallsMade: result.toolCallsMade,
      usage: result.usage,
      elapsedMs: result.elapsedMs,
    });
  } catch (err) {
    console.error("clara handler failed:", err);
    return respond(500, {
      ok: false,
      error: err.message || "Clara encountered an internal error.",
    });
  }
};
