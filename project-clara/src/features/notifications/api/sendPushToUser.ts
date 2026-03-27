// sends a push notification to a user by looking up their expo tokens from dynamodb
// then hitting the expo push api
// this is fire and forget, if it fails the message still sends fine
import { fetchPushTokensForUser } from "./pushTokenRepo";
import { generateClient } from "aws-amplify/api";
import { deletePushToken } from "@/src/graphql/mutations";
import { pushTokensByUserId } from "@/src/graphql/queries";

const client = generateClient();

interface PushPayload {
  recipientUserId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushToUser(payload: PushPayload): Promise<void> {
  try {
    // look up all the devices this user has registered
    const { data: tokens } = await fetchPushTokensForUser(
      payload.recipientUserId
    );
    if (!tokens || tokens.length === 0) {
      console.log("sendPushToUser: no tokens found for user", payload.recipientUserId);
      return;
    }

    console.log("sendPushToUser: sending to", tokens.length, "device(s) for user", payload.recipientUserId);

    // build a message for each device token
    const messages = tokens.map((token) => ({
      to: token,
      sound: "default" as const,
      title: payload.title,
      // keep notification preview short, truncate long messages
      body:
        payload.body.length > 100
          ? payload.body.substring(0, 97) + "..."
          : payload.body,
      data: payload.data ?? {},
      badge: 1,
    }));

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    // actually check what expo says back so we can spot problems
    const responseData = await response.json();
    console.log("sendPushToUser: expo response", JSON.stringify(responseData));

    // clean up dead tokens if expo tells us a device is no longer registered
    // this prevents zombie tokens from piling up in the database
    if (responseData?.data) {
      const tickets = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        if (ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered") {
          const deadToken = tokens[i];
          console.log("sendPushToUser: removing dead token", deadToken);
          // find the pushtoken record in dynamodb and delete it
          try {
            const result: any = await client.graphql({
              query: pushTokensByUserId,
              variables: { userId: payload.recipientUserId },
            });
            const items = result.data?.pushTokensByUserId?.items ?? [];
            const match = items.find((t: any) => t.token === deadToken && !t._deleted);
            if (match) {
              await client.graphql({
                query: deletePushToken,
                variables: { input: { id: match.id } },
              });
              console.log("sendPushToUser: dead token removed from db");
            }
          } catch (cleanupErr) {
            console.warn("sendPushToUser: failed to clean up dead token:", cleanupErr);
          }
        }
      }
    }
  } catch (err) {
    // fire-and-forget: don't block message sending if push fails
    console.warn("sendPushToUser failed:", err);
  }
}
