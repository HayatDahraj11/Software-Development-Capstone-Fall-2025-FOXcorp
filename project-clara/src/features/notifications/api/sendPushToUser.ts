// sends a push notification to a user by looking up their expo tokens from dynamodb
// then hitting the expo push api
// this is fire and forget, if it fails the message still sends fine
import { fetchPushTokensForUser } from "./pushTokenRepo";

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
    if (!tokens || tokens.length === 0) return;

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

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });
  } catch (err) {
    // fire-and-forget: don't block message sending if push fails
    console.warn("sendPushToUser failed:", err);
  }
}
