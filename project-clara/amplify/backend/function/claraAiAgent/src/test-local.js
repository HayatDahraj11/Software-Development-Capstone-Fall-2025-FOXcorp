/**
 * test-local.js
 *
 * Quick smoke test for the Clara Lambda, invokes the handler in-process
 * with a fake parent/conversation id and prints the result. Useful for
 * verifying OpenAI + AppSync credentials before you point the mobile
 * app at the real endpoint.
 *
 * Usage:
 *   cd amplify/backend/function/claraAiAgent/src
 *   node -r dotenv/config test-local.js <parentId> <conversationId> "your question"
 *
 * Example:
 *   node -r dotenv/config test-local.js \
 *     parent-abc123 convo-xyz789 "How has Tommy been doing this week?"
 */

const { handler } = require("./index");

const [, , parentId, conversationId, ...messageParts] = process.argv;
const userMessage = messageParts.join(" ");

if (!parentId || !conversationId || !userMessage) {
  console.error(
    "Usage: node test-local.js <parentId> <conversationId> <message>"
  );
  process.exit(1);
}

(async () => {
  const event = {
    httpMethod: "POST",
    body: JSON.stringify({ parentId, conversationId, userMessage }),
  };

  const res = await handler(event);
  console.log("Status:", res.statusCode);
  console.log("Body:", JSON.parse(res.body));
})();
