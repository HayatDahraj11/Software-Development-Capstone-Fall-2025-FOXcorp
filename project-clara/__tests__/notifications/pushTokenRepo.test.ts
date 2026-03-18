// Mock aws-amplify/api before importing anything
const mockGraphql = jest.fn();
jest.mock("aws-amplify/api", () => ({
  generateClient: () => ({ graphql: mockGraphql }),
}));

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("@/src/graphql/queries", () => ({
  pushTokensByUserId: "pushTokensByUserId",
}));

jest.mock("@/src/graphql/mutations", () => ({
  createPushToken: "createPushToken",
  deletePushToken: "deletePushToken",
}));

jest.mock("@/src/API", () => ({
  SenderType: { PARENT: "PARENT", TEACHER: "TEACHER" },
}));

import {
  registerPushToken,
  unregisterPushTokens,
  fetchPushTokensForUser,
} from "@/src/features/notifications/api/pushTokenRepo";
import { SenderType } from "@/src/API";

beforeEach(() => {
  mockGraphql.mockReset();
});

// ─── registerPushToken ───────────────────────────────────────

describe("registerPushToken", () => {
  it("creates a new token when none exists", async () => {
    // First call: query returns empty list
    mockGraphql.mockResolvedValueOnce({
      data: { pushTokensByUserId: { items: [] } },
    });
    // Second call: create mutation
    mockGraphql.mockResolvedValueOnce({
      data: { createPushToken: { id: "new-token-id" } },
    });

    const result = await registerPushToken("user1", SenderType.PARENT, "ExponentPushToken[abc]");

    expect(result.data).toBe("new-token-id");
    expect(result.error).toBeNull();
    expect(mockGraphql).toHaveBeenCalledTimes(2);

    // Verify create was called with correct input
    const createCall = mockGraphql.mock.calls[1][0];
    expect(createCall.variables.input).toEqual({
      userId: "user1",
      userType: "PARENT",
      token: "ExponentPushToken[abc]",
      platform: "ios",
    });
  });

  it("returns existing token ID if already registered (dedup)", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        pushTokensByUserId: {
          items: [
            { id: "existing-id", token: "ExponentPushToken[abc]", _deleted: false },
          ],
        },
      },
    });

    const result = await registerPushToken("user1", SenderType.PARENT, "ExponentPushToken[abc]");

    expect(result.data).toBe("existing-id");
    expect(result.error).toBeNull();
    // Should NOT call create
    expect(mockGraphql).toHaveBeenCalledTimes(1);
  });

  it("ignores _deleted tokens and creates new one", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        pushTokensByUserId: {
          items: [
            { id: "deleted-id", token: "ExponentPushToken[abc]", _deleted: true },
          ],
        },
      },
    });
    mockGraphql.mockResolvedValueOnce({
      data: { createPushToken: { id: "fresh-id" } },
    });

    const result = await registerPushToken("user1", SenderType.PARENT, "ExponentPushToken[abc]");

    expect(result.data).toBe("fresh-id");
    expect(mockGraphql).toHaveBeenCalledTimes(2);
  });

  it("returns error on graphql failure", async () => {
    mockGraphql.mockRejectedValueOnce(new Error("Network error"));

    const result = await registerPushToken("user1", SenderType.PARENT, "ExponentPushToken[abc]");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Could not register push token.");
  });
});

// ─── unregisterPushTokens ───────────────────────────────────

describe("unregisterPushTokens", () => {
  it("deletes all non-deleted tokens for a user", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        pushTokensByUserId: {
          items: [
            { id: "t1", _deleted: false },
            { id: "t2", _deleted: true },
            { id: "t3", _deleted: false },
          ],
        },
      },
    });
    // Two delete calls (t1 and t3, skip t2)
    mockGraphql.mockResolvedValueOnce({ data: { deletePushToken: { id: "t1" } } });
    mockGraphql.mockResolvedValueOnce({ data: { deletePushToken: { id: "t3" } } });

    const result = await unregisterPushTokens("user1");

    expect(result.data).toBe(true);
    expect(mockGraphql).toHaveBeenCalledTimes(3); // 1 query + 2 deletes
  });

  it("handles empty token list", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { pushTokensByUserId: { items: [] } },
    });

    const result = await unregisterPushTokens("user1");

    expect(result.data).toBe(true);
    expect(mockGraphql).toHaveBeenCalledTimes(1);
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce(new Error("fail"));

    const result = await unregisterPushTokens("user1");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Could not unregister push tokens.");
  });
});

// ─── fetchPushTokensForUser ─────────────────────────────────

describe("fetchPushTokensForUser", () => {
  it("returns array of token strings, filtering out deleted", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        pushTokensByUserId: {
          items: [
            { token: "ExponentPushToken[aaa]", _deleted: false },
            { token: "ExponentPushToken[bbb]", _deleted: true },
            { token: "ExponentPushToken[ccc]", _deleted: false },
          ],
        },
      },
    });

    const result = await fetchPushTokensForUser("user1");

    expect(result.data).toEqual([
      "ExponentPushToken[aaa]",
      "ExponentPushToken[ccc]",
    ]);
    expect(result.error).toBeNull();
  });

  it("returns empty array when no tokens exist", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { pushTokensByUserId: { items: [] } },
    });

    const result = await fetchPushTokensForUser("user1");

    expect(result.data).toEqual([]);
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce(new Error("fail"));

    const result = await fetchPushTokensForUser("user1");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Could not fetch push tokens.");
  });
});
