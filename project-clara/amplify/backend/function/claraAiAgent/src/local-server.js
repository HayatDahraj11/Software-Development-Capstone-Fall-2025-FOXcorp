/**
 * local-server.js
 *
 * Runs the exact same Lambda handler behind a local HTTP server so you
 * can develop and test Clara end-to-end without deploying to AWS.
 *
 * Usage:
 *   cd amplify/backend/function/claraAiAgent/src
 *   # create .env with GEMINI_API_KEY, APPSYNC_ENDPOINT, APPSYNC_API_KEY
 *   node -r dotenv/config local-server.js
 *
 * Or in npm terms:
 *   npm install
 *   npm run start
 *
 * The mobile app can point at http://<your-laptop-ip>:3000/clara instead
 * of the deployed API Gateway URL while you iterate. Once it all works,
 * run `amplify push` and switch the URL, the handler code does not
 * change.
 */

const http = require("http");
const { handler } = require("./index");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Collect request body
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // Build a minimal API-Gateway-like event
    const event = {
      httpMethod: req.method,
      path: req.url,
      headers: req.headers,
      body: rawBody,
      requestContext: { http: { method: req.method } },
    };

    try {
      const result = await handler(event);
      res.writeHead(result.statusCode, result.headers);
      res.end(result.body);
    } catch (err) {
      console.error("local-server: handler threw:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Clara local server listening on http://localhost:${PORT}`);
  console.log(
    `POST a JSON body { conversationId, parentId, userMessage } to any path.`
  );
});
