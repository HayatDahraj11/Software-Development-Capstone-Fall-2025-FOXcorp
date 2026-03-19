// manages expo push tokens in dynamodb
// each user can have multiple tokens (one per device they log in on)
// tokens are stored in the PushToken table with a byUser index for fast lookups
import { generateClient } from "aws-amplify/api";
import { pushTokensByUserId } from "@/src/graphql/queries";
import { createPushToken, deletePushToken } from "@/src/graphql/mutations";
import { SenderType } from "@/src/API";
import { Platform } from "react-native";

const client = generateClient();

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

// saves a push token to the backend
// checks if the token already exists first so we dont get duplicates
export async function registerPushToken(
  userId: string,
  userType: SenderType,
  token: string
): Promise<RepoResult<string>> {
  try {
    const existing: any = await client.graphql({
      query: pushTokensByUserId,
      variables: { userId },
    });
    const items = existing.data?.pushTokensByUserId?.items ?? [];
    const alreadyRegistered = items.find(
      (t: any) => t.token === token && !t._deleted
    );
    if (alreadyRegistered) {
      return { data: alreadyRegistered.id, error: null };
    }

    const result: any = await client.graphql({
      query: createPushToken,
      variables: {
        input: {
          userId,
          userType,
          token,
          platform: Platform.OS,
        },
      },
    });
    return { data: result.data.createPushToken.id, error: null };
  } catch (err) {
    console.error("registerPushToken failed:", err);
    return { data: null, error: "Could not register push token." };
  }
}

// removes all push tokens for a user (for when they log out)
// skips already deleted ones
export async function unregisterPushTokens(
  userId: string
): Promise<RepoResult<boolean>> {
  try {
    const existing: any = await client.graphql({
      query: pushTokensByUserId,
      variables: { userId },
    });
    const items = existing.data?.pushTokensByUserId?.items ?? [];
    for (const item of items) {
      if (item._deleted) continue;
      await client.graphql({
        query: deletePushToken,
        variables: { input: { id: item.id } },
      });
    }
    return { data: true, error: null };
  } catch (err) {
    console.error("unregisterPushTokens failed:", err);
    return { data: null, error: "Could not unregister push tokens." };
  }
}

// gets all active push tokens for a user so we can send them notifications
// filters out soft deleted ones
export async function fetchPushTokensForUser(
  userId: string
): Promise<RepoResult<string[]>> {
  try {
    const result: any = await client.graphql({
      query: pushTokensByUserId,
      variables: { userId },
    });
    const tokens = (result.data?.pushTokensByUserId?.items ?? [])
      .filter((t: any) => !t._deleted)
      .map((t: any) => t.token);
    return { data: tokens, error: null };
  } catch (err) {
    console.error("fetchPushTokensForUser failed:", err);
    return { data: null, error: "Could not fetch push tokens." };
  }
}
