#!/usr/bin/env node
/**
 * seed-clara.js
 *
 * One-time setup: creates a Teacher row in DynamoDB with the fixed id
 * `clara-ai-bot` so Clara can participate in conversations without the
 * schema needing a special "BOT" sender type.
 *
 * Why a Teacher record?
 *   Conversation.teacherId is ID!, not null. Using an existing sender
 *   type (TEACHER) means the messaging UI and subscriptions don't need
 *   special cases, Clara's reply shows up in the thread the same way
 *   a human teacher's would.
 *
 * Usage:
 *   node scripts/seed-clara.js
 *
 * You can override the AppSync endpoint/key via environment variables:
 *   APPSYNC_ENDPOINT=... APPSYNC_API_KEY=... node scripts/seed-clara.js
 *
 * Idempotent: running it twice is a no-op (it checks before creating).
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

// Discover AppSync endpoint + key from amplify-meta.json.

function loadAmplifyConfig() {
  const metaPath = path.join(
    __dirname,
    "..",
    "amplify",
    "backend",
    "amplify-meta.json"
  );
  if (!fs.existsSync(metaPath)) {
    throw new Error(
      "amplify/backend/amplify-meta.json not found. Run this script from the project root after `amplify push` has succeeded."
    );
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const api = meta?.api?.projectclara?.output;
  if (!api) {
    throw new Error("Couldn't find api.projectclara.output in amplify-meta.json");
  }
  return {
    endpoint: api.GraphQLAPIEndpointOutput,
    apiKey: api.GraphQLAPIKeyOutput,
  };
}

const { endpoint: AUTO_ENDPOINT, apiKey: AUTO_KEY } = loadAmplifyConfig();

const ENDPOINT = process.env.APPSYNC_ENDPOINT || AUTO_ENDPOINT;
const API_KEY = process.env.APPSYNC_API_KEY || AUTO_KEY;

if (!ENDPOINT || !API_KEY) {
  console.error("Missing AppSync endpoint or API key.");
  process.exit(1);
}

// GraphQL helpers.

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors && !json.data) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

// Operations.

const GET_TEACHER = /* GraphQL */ `
  query GetTeacher($id: ID!) {
    getTeacher(id: $id) {
      id
      name
    }
  }
`;

const LIST_SCHOOLS = /* GraphQL */ `
  query ListSchools {
    listSchools(limit: 5) {
      items {
        id
        name
      }
    }
  }
`;

const CREATE_SCHOOL = /* GraphQL */ `
  mutation CreateSchool($input: CreateSchoolInput!) {
    createSchool(input: $input) {
      id
      name
    }
  }
`;

const CREATE_TEACHER = /* GraphQL */ `
  mutation CreateTeacher($input: CreateTeacherInput!) {
    createTeacher(input: $input) {
      id
      name
      schoolId
    }
  }
`;

// Main.

const CLARA_ID = "clara-ai-bot";
const CLARA_NAME = "Clara";

async function main() {
  console.log(`Seeding Clara against ${ENDPOINT}`);

  // 1. Check if Clara already exists
  const existing = await gql(GET_TEACHER, { id: CLARA_ID });
  if (existing?.getTeacher) {
    console.log(`✓ Clara already exists (id=${CLARA_ID}). Nothing to do.`);
    return;
  }

  // 2. Find or create a School so Clara can reference a schoolId
  let schoolId;
  const schools = await gql(LIST_SCHOOLS);
  const schoolItems = schools?.listSchools?.items ?? [];
  if (schoolItems.length > 0) {
    schoolId = schoolItems[0].id;
    console.log(
      `Using existing school: ${schoolItems[0].name} (id=${schoolId})`
    );
  } else {
    const created = await gql(CREATE_SCHOOL, {
      input: {
        name: "Project Clara Demo School",
        address: "1 Demo Way",
      },
    });
    schoolId = created.createSchool.id;
    console.log(`Created demo school (id=${schoolId})`);
  }

  // 3. Create Clara
  const created = await gql(CREATE_TEACHER, {
    input: {
      id: CLARA_ID,
      name: CLARA_NAME,
      schoolId,
    },
  });
  console.log(
    `✓ Created Clara Teacher row: id=${created.createTeacher.id} schoolId=${schoolId}`
  );
  console.log(
    "\nNext steps:\n" +
      "  1. Deploy the Lambda:  amplify push\n" +
      "  2. Set the Lambda environment variables (OPENAI_API_KEY, APPSYNC_ENDPOINT, APPSYNC_API_KEY)\n" +
      "  3. Copy the API Gateway invoke URL into .env.local:\n" +
      "       EXPO_PUBLIC_CLARA_ENDPOINT=https://....execute-api.us-east-1.amazonaws.com/dev/clara\n" +
      "  4. Rebuild the mobile app and tap 'Ask Clara' on the parent home screen.\n"
  );
}

main().catch((err) => {
  console.error("seed-clara failed:", err);
  process.exit(1);
});
