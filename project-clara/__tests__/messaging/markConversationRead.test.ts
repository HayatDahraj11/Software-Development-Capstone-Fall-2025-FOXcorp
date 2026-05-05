const mockGraphql = jest.fn();
jest.mock("aws-amplify/api", () => ({
  generateClient: () => ({ graphql: mockGraphql }),
}));

// stub out the generated GraphQL operations the repo imports.
// values are arbitrary, we only assert what the repo does with them.
jest.mock("@/src/graphql/queries", () => ({
  conversationsByParentId: "conversationsByParentId",
  conversationsByTeacherId: "conversationsByTeacherId",
  messagesByConversationIdAndCreatedAt: "messagesByConversationIdAndCreatedAt",
  getConversation: "getConversation",
}));
jest.mock("@/src/graphql/mutations", () => ({
  createConversation: "createConversation",
  createMessage: "createMessage",
  updateConversation: "updateConversation",
}));
jest.mock("@/src/graphql/subscriptions", () => ({
  onCreateMessage: "onCreateMessage",
  onUpdateConversation: "onUpdateConversation",
}));

// keep the post-send side-effects out of these unit tests
jest.mock("@/src/features/notifications/api/sendPushToUser", () => ({
  sendPushToUser: jest.fn(),
}));
jest.mock("@/src/features/clara/api/claraRepo", () => ({
  CLARA_BOT_ID: "clara-ai-bot",
  triggerClaraReply: jest.fn(),
}));

import { markConversationRead } from "@/src/features/messaging/api/markConversationRead";

beforeEach(() => {
  mockGraphql.mockReset();
});

describe("markConversationRead", () => {
  it("writes parentLastReadAt for parent role", async () => {
    mockGraphql.mockResolvedValueOnce({ data: { updateConversation: { id: "c1" } } });

    await markConversationRead({ conversationId: "c1", viewerRole: "parent" });

    expect(mockGraphql).toHaveBeenCalledTimes(1);
    const call = mockGraphql.mock.calls[0][0];
    expect(call.query).toBe("updateConversation");
    expect(call.variables.input.id).toBe("c1");
    expect(call.variables.input.parentLastReadAt).toEqual(expect.any(String));
    // sanity: it's a valid ISO date string
    expect(() => new Date(call.variables.input.parentLastReadAt).toISOString()).not.toThrow();
    // does NOT touch the teacher field
    expect(call.variables.input).not.toHaveProperty("teacherLastReadAt");
  });

  it("writes teacherLastReadAt for teacher role", async () => {
    mockGraphql.mockResolvedValueOnce({ data: { updateConversation: { id: "c1" } } });

    await markConversationRead({ conversationId: "c1", viewerRole: "teacher" });

    const call = mockGraphql.mock.calls[0][0];
    expect(call.variables.input.id).toBe("c1");
    expect(call.variables.input.teacherLastReadAt).toEqual(expect.any(String));
    // does NOT touch the parent field
    expect(call.variables.input).not.toHaveProperty("parentLastReadAt");
  });

  it("never touches lastMessageText/lastMessageAt (so it cant collide with sendMessages preview update)", async () => {
    mockGraphql.mockResolvedValueOnce({ data: { updateConversation: { id: "c1" } } });

    await markConversationRead({ conversationId: "c1", viewerRole: "parent" });

    const input = mockGraphql.mock.calls[0][0].variables.input;
    expect(input).not.toHaveProperty("lastMessageText");
    expect(input).not.toHaveProperty("lastMessageAt");
  });

  it("is a no-op when conversationId is empty (no graphql call made)", async () => {
    await markConversationRead({ conversationId: "", viewerRole: "parent" });
    expect(mockGraphql).not.toHaveBeenCalled();
  });

  it("swallows graphql errors silently (does not throw)", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockGraphql.mockRejectedValueOnce(new Error("boom"));

    await expect(
      markConversationRead({ conversationId: "c1", viewerRole: "parent" })
    ).resolves.toBeUndefined();

    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("uses an ISO timestamp close to now", async () => {
    mockGraphql.mockResolvedValueOnce({ data: { updateConversation: { id: "c1" } } });
    const before = Date.now();
    await markConversationRead({ conversationId: "c1", viewerRole: "parent" });
    const after = Date.now();

    const stamp = mockGraphql.mock.calls[0][0].variables.input.parentLastReadAt;
    const t = new Date(stamp).getTime();
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(after);
  });
});
