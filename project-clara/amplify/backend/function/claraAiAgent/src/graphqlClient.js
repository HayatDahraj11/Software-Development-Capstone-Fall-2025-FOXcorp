/**
 * graphqlClient.js
 *
 * Thin wrapper around AWS AppSync GraphQL using Node 18+ native fetch.
 * Keeps the Lambda zip small (no aws-amplify SDK required) and avoids
 * IAM complexity by using the API key that already exists for the app.
 *
 * All Lambda→DynamoDB access flows through the existing GraphQL schema so
 * we reuse the same resolvers, authorization rules, and GSIs the mobile
 * app uses. No schema drift, no duplicate access paths.
 */

const APPSYNC_ENDPOINT = process.env.APPSYNC_ENDPOINT;
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

if (!APPSYNC_ENDPOINT || !APPSYNC_API_KEY) {
  console.warn(
    "graphqlClient: APPSYNC_ENDPOINT or APPSYNC_API_KEY not set. Lambda will fail to query backend."
  );
}

/**
 * Execute a GraphQL query or mutation against the AppSync endpoint.
 *
 * @param {string} query - GraphQL query/mutation string
 * @param {object} variables - Query variables
 * @returns {Promise<object>} The `data` field from the GraphQL response
 * @throws Error when GraphQL returns errors or the HTTP request fails
 */
async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": APPSYNC_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AppSync HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();

  // AppSync can return data AND errors at the same time (partial success on
  // nested @belongsTo resolvers). If there is usable data we return it; we
  // only throw when there is no data at all.
  if (json.errors && !json.data) {
    throw new Error(
      `GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`
    );
  }

  if (json.errors) {
    console.warn(
      "GraphQL partial errors:",
      json.errors.map((e) => e.message).join("; ")
    );
  }

  return json.data;
}

module.exports = { gql };
