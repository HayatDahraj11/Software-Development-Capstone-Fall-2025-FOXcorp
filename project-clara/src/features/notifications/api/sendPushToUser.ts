import { fetchPushTokensForUser } from "./pushTokenRepo";

interface PushPayload {
  recipientUserId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushToUser(payload: PushPayload): Promise<void> {
  try {
    const { data: tokens } = await fetchPushTokensForUser(
      payload.recipientUserId
    );
    if (!tokens || tokens.length === 0) return;

    const messages = tokens.map((token) => ({
      to: token,
      sound: "default" as const,
      title: payload.title,
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
