import { computeUnread, computeSeen } from "@/src/features/messaging/logic/readReceipts";
import type { Conversation } from "@/src/features/messaging/api/messageRepo";

// helper to build a Conversation with sane defaults
function convo(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: "c1",
    type: "DIRECT",
    teacherId: "t1",
    parentId: "p1",
    studentId: "s1",
    parentName: "P One",
    teacherName: "T One",
    studentName: "S One",
    lastMessageText: "hi",
    lastMessageAt: "2026-05-01T10:00:00.000Z",
    parentLastReadAt: null,
    teacherLastReadAt: null,
    ...overrides,
  };
}

// ─── computeUnread ─────────────────────────────────────────────

describe("computeUnread", () => {
  it("returns false for an empty thread (no lastMessageAt)", () => {
    const c = convo({ lastMessageAt: null });
    expect(computeUnread(c, "parent")).toBe(false);
    expect(computeUnread(c, "teacher")).toBe(false);
  });

  it("returns true on the parent side when parentLastReadAt is null and there are messages", () => {
    const c = convo({ parentLastReadAt: null });
    expect(computeUnread(c, "parent")).toBe(true);
  });

  it("returns true on the teacher side when teacherLastReadAt is null and there are messages", () => {
    const c = convo({ teacherLastReadAt: null });
    expect(computeUnread(c, "teacher")).toBe(true);
  });

  it("returns true when lastMessageAt is strictly after parentLastReadAt", () => {
    const c = convo({
      lastMessageAt: "2026-05-01T10:00:00.000Z",
      parentLastReadAt: "2026-05-01T09:59:00.000Z",
    });
    expect(computeUnread(c, "parent")).toBe(true);
  });

  it("returns false when lastMessageAt equals parentLastReadAt (just read)", () => {
    const ts = "2026-05-01T10:00:00.000Z";
    const c = convo({ lastMessageAt: ts, parentLastReadAt: ts });
    expect(computeUnread(c, "parent")).toBe(false);
  });

  it("returns false when lastMessageAt is before parentLastReadAt", () => {
    const c = convo({
      lastMessageAt: "2026-05-01T09:00:00.000Z",
      parentLastReadAt: "2026-05-01T10:00:00.000Z",
    });
    expect(computeUnread(c, "parent")).toBe(false);
  });

  it("uses teacherLastReadAt for teacher viewer, ignores parentLastReadAt", () => {
    const c = convo({
      lastMessageAt: "2026-05-01T10:00:00.000Z",
      parentLastReadAt: "2026-05-01T11:00:00.000Z", // newer but irrelevant
      teacherLastReadAt: "2026-05-01T09:00:00.000Z",
    });
    expect(computeUnread(c, "teacher")).toBe(true);
  });

  it("returns false for GROUP threads on the parent side regardless of state (v1 limitation)", () => {
    const c = convo({
      type: "GROUP",
      parentLastReadAt: null,
      lastMessageAt: "2026-05-01T10:00:00.000Z",
    });
    expect(computeUnread(c, "parent")).toBe(false);
  });

  it("still works for GROUP threads on the teacher side (only one teacher)", () => {
    const c = convo({
      type: "GROUP",
      teacherLastReadAt: "2026-05-01T09:00:00.000Z",
      lastMessageAt: "2026-05-01T10:00:00.000Z",
    });
    expect(computeUnread(c, "teacher")).toBe(true);
  });
});

// ─── computeSeen ───────────────────────────────────────────────

const me = "user-me";
const them = "user-them";

function msg(senderId: string, createdAt: string) {
  return { senderId, createdAt };
}

describe("computeSeen", () => {
  it("is false when message is from the other party", () => {
    expect(
      computeSeen({
        message: msg(them, "2026-05-01T10:00:00.000Z"),
        currentUserId: me,
        isLastOwnMessage: true,
        otherLastReadAt: "2026-05-01T11:00:00.000Z",
      })
    ).toBe(false);
  });

  it("is false on own messages that arent the latest own (no wall of Seen)", () => {
    expect(
      computeSeen({
        message: msg(me, "2026-05-01T10:00:00.000Z"),
        currentUserId: me,
        isLastOwnMessage: false,
        otherLastReadAt: "2026-05-01T11:00:00.000Z",
      })
    ).toBe(false);
  });

  it("is false when otherLastReadAt is null (other party has never opened)", () => {
    expect(
      computeSeen({
        message: msg(me, "2026-05-01T10:00:00.000Z"),
        currentUserId: me,
        isLastOwnMessage: true,
        otherLastReadAt: null,
      })
    ).toBe(false);
  });

  it("is true when own + last own + otherLastReadAt strictly after createdAt", () => {
    expect(
      computeSeen({
        message: msg(me, "2026-05-01T10:00:00.000Z"),
        currentUserId: me,
        isLastOwnMessage: true,
        otherLastReadAt: "2026-05-01T10:00:01.000Z",
      })
    ).toBe(true);
  });

  it("is true when otherLastReadAt equals createdAt (read at exactly the same instant)", () => {
    const ts = "2026-05-01T10:00:00.000Z";
    expect(
      computeSeen({
        message: msg(me, ts),
        currentUserId: me,
        isLastOwnMessage: true,
        otherLastReadAt: ts,
      })
    ).toBe(true);
  });

  it("is false when otherLastReadAt is older than createdAt (they read before this message arrived)", () => {
    expect(
      computeSeen({
        message: msg(me, "2026-05-01T10:00:00.000Z"),
        currentUserId: me,
        isLastOwnMessage: true,
        otherLastReadAt: "2026-05-01T09:59:00.000Z",
      })
    ).toBe(false);
  });
});
