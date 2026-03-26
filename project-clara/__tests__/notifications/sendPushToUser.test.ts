// Mock pushTokenRepo
const mockFetchPushTokensForUser = jest.fn();
jest.mock("@/src/features/notifications/api/pushTokenRepo", () => ({
  fetchPushTokensForUser: (...args: any[]) => mockFetchPushTokensForUser(...args),
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

import { sendPushToUser } from "@/src/features/notifications/api/sendPushToUser";

beforeEach(() => {
  mockFetchPushTokensForUser.mockReset();
  mockFetch.mockReset();
});

describe("sendPushToUser", () => {
  it("sends push notification to all user tokens", async () => {
    mockFetchPushTokensForUser.mockResolvedValueOnce({
      data: ["ExponentPushToken[aaa]", "ExponentPushToken[bbb]"],
    });
    mockFetch.mockResolvedValueOnce({ ok: true });

    await sendPushToUser({
      recipientUserId: "user1",
      title: "New Message",
      body: "Hello there",
      data: { route: "/(parent)/conversation" },
    });

    expect(mockFetchPushTokensForUser).toHaveBeenCalledWith("user1");
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://exp.host/--/api/v2/push/send");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({
      to: "ExponentPushToken[aaa]",
      sound: "default",
      title: "New Message",
      body: "Hello there",
      data: { route: "/(parent)/conversation" },
      badge: 1,
    });
    expect(body[1].to).toBe("ExponentPushToken[bbb]");
  });

  it("truncates body longer than 100 chars", async () => {
    const longBody = "A".repeat(150);
    mockFetchPushTokensForUser.mockResolvedValueOnce({
      data: ["ExponentPushToken[aaa]"],
    });
    mockFetch.mockResolvedValueOnce({ ok: true });

    await sendPushToUser({
      recipientUserId: "user1",
      title: "Test",
      body: longBody,
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body[0].body).toBe("A".repeat(97) + "...");
    expect(body[0].body.length).toBe(100);
  });

  it("does nothing when user has no tokens", async () => {
    mockFetchPushTokensForUser.mockResolvedValueOnce({ data: [] });

    await sendPushToUser({
      recipientUserId: "user1",
      title: "Test",
      body: "Hello",
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does nothing when token fetch returns null", async () => {
    mockFetchPushTokensForUser.mockResolvedValueOnce({ data: null });

    await sendPushToUser({
      recipientUserId: "user1",
      title: "Test",
      body: "Hello",
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("swallows errors silently (fire-and-forget)", async () => {
    mockFetchPushTokensForUser.mockRejectedValueOnce(new Error("Network fail"));

    // Should not throw
    await expect(
      sendPushToUser({
        recipientUserId: "user1",
        title: "Test",
        body: "Hello",
      })
    ).resolves.toBeUndefined();
  });

  it("includes empty data object when no data provided", async () => {
    mockFetchPushTokensForUser.mockResolvedValueOnce({
      data: ["ExponentPushToken[aaa]"],
    });
    mockFetch.mockResolvedValueOnce({ ok: true });

    await sendPushToUser({
      recipientUserId: "user1",
      title: "Test",
      body: "Hello",
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body[0].data).toEqual({});
  });
});
