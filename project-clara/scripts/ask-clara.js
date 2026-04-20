#!/usr/bin/env node
/**
 * ask-clara.js
 *
 * Sends a message to Clara from the command line and prints her reply.
 * Useful for smoke-testing the Lambda + tool-use loop without firing
 * up the mobile app.
 *
 * Usage:
 *   node scripts/ask-clara.js <parentId> "your message"
 *
 * Requires EXPO_PUBLIC_CLARA_ENDPOINT (or CLARA_ENDPOINT) in the env,
 * pointing at either the local dev server or the deployed API Gateway.
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

// Find-or-create a Clara conversation for this parent so the caller
// does not need to know the conversationId.
function loadAmplifyConfig() {
  const metaPath = path.join(
    __dirname,
    "..",
    "amplify",
    "backend",
    "amplify-meta.json"
  );
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const api = meta?.api?.projectclara?.output;
  return {
    endpoint: api.GraphQLAPIEndpointOutput,
    apiKey: api.GraphQLAPIKeyOutput,
  };
}

const { endpoint: AUTO_ENDPOINT, apiKey: AUTO_KEY } = loadAmplifyConfig();
const GRAPHQL = process.env.APPSYNC_ENDPOINT || AUTO_ENDPOINT;
const GQL_KEY = process.env.APPSYNC_API_KEY || AUTO_KEY;

async function gql(query, variables = {}) {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": GQL_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors && !json.data) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const LIST_CONVOS = /* GraphQL */ `
  query ($parentId: ID!) {
    conversationsByParentId(parentId: $parentId) {
      items {
        id
        teacherId
        type
      }
    }
  }
`;

const CREATE_CONVO = /* GraphQL */ `
  mutation ($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
    }
  }
`;

const CREATE_MESSAGE = /* GraphQL */ `
  mutation ($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
    }
  }
`;

const CLARA_BOT_ID = "clara-ai-bot";

async function getOrCreateClaraConvo(parentId) {
  const data = await gql(LIST_CONVOS, { parentId });
  const existing = (data?.conversationsByParentId?.items ?? []).find(
    (c) => c.type === "DIRECT" && c.teacherId === CLARA_BOT_ID
  );
  if (existing) return existing.id;

  const created = await gql(CREATE_CONVO, {
    input: {
      type: "DIRECT",
      parentId,
      teacherId: CLARA_BOT_ID,
      parentName: "CLI Tester",
      teacherName: "Clara",
    },
  });
  return created.createConversation.id;
}

async function main() {
  const [, , parentId, ...msgParts] = process.argv;
  const userMessage = msgParts.join(" ");
  const endpoint =
    process.env.EXPO_PUBLIC_CLARA_ENDPOINT || process.env.CLARA_ENDPOINT;

  if (!parentId || !userMessage) {
    console.error("Usage: node scripts/ask-clara.js <parentId> <message>");
    process.exit(1);
  }
  if (!endpoint) {
    console.error(
      "Set EXPO_PUBLIC_CLARA_ENDPOINT or CLARA_ENDPOINT to the Lambda/local-server URL."
    );
    process.exit(1);
  }

  const conversationId = await getOrCreateClaraConvo(parentId);
  console.log(`Using Clara conversation id=${conversationId}`);

  // Post the user's message so Clara's Lambda has it in the history
  await gql(CREATE_MESSAGE, {
    input: {
      conversationId,
      senderId: parentId,
      senderType: "PARENT",
      senderName: "CLI Tester",
      body: userMessage,
      createdAt: new Date().toISOString(),
    },
  });

  console.log(`→ You: ${userMessage}`);
  console.log(`(thinking…)\n`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, parentId, userMessage }),
  });
  const body = await res.json();

  if (!body.ok) {
    console.error("Clara error:", body.error);
    process.exit(1);
  }

  console.log(`← Clara: ${body.reply}`);
  console.log(
    `\n(tools=${body.toolCallsMade} tokens=${body.usage?.total_tokens} time=${body.elapsedMs}ms)`
  );
}

main().catch((err) => {
  console.error("ask-clara failed:", err);
  process.exit(1);
});
