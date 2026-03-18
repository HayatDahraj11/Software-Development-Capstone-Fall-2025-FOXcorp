import { generateClient } from "aws-amplify/api";
import { pushTokensByUserId } from "@/src/graphql/queries";
import { createPushToken, deletePushToken } from "@/src/graphql/mutations";
import { Platform } from "react-native";

const client = generateClient();

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

export async function registerPushToken(
  userId: string,
  userType: "PARENT" | "TEACHER",
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
