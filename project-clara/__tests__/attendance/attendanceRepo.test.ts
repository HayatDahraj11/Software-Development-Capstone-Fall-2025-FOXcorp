const mockGraphql = jest.fn();
jest.mock("aws-amplify/api", () => ({
  generateClient: () => ({ graphql: mockGraphql }),
}));

jest.mock("@/src/graphql/queries", () => ({
  attendancesByClassId: "attendancesByClassId",
}));

jest.mock("@/src/graphql/mutations", () => ({
  createAttendance: "createAttendance",
  updateAttendance: "updateAttendance",
}));

jest.mock("@/src/API", () => ({
  AttendanceStatus: { PRESENT: "PRESENT", ABSENT: "ABSENT", LATE: "LATE" },
}));

import {
  fetchAttendanceByClass,
  submitAttendance,
  changeAttendance,
} from "@/src/features/attendance/api/attendanceRepo";

beforeEach(() => {
  mockGraphql.mockReset();
});

// ─── fetchAttendanceByClass ─────────────────────────────────

describe("fetchAttendanceByClass", () => {
  it("returns attendance records for a class", async () => {
    const mockItems = [
      { id: "a1", studentId: "s1", classId: "c1", date: "2026-03-18", status: "PRESENT", createdAt: "2026-03-18T10:00:00Z" },
      { id: "a2", studentId: "s2", classId: "c1", date: "2026-03-18", status: "ABSENT", createdAt: "2026-03-18T10:00:00Z" },
    ];
    mockGraphql.mockResolvedValueOnce({
      data: { attendancesByClassId: { items: mockItems } },
    });

    const result = await fetchAttendanceByClass("c1");

    expect(result.data).toHaveLength(2);
    expect(result.data![0].status).toBe("PRESENT");
    expect(result.data![1].status).toBe("ABSENT");
    expect(result.error).toBeNull();
  });

  it("returns empty array when no records exist", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { attendancesByClassId: { items: [] } },
    });

    const result = await fetchAttendanceByClass("c1");

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("handles null response gracefully", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { attendancesByClassId: null },
    });

    const result = await fetchAttendanceByClass("c1");

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchAttendanceByClass("c1");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Network error");
  });
});

// ─── submitAttendance ───────────────────────────────────────

describe("submitAttendance", () => {
  it("creates a new attendance record", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        createAttendance: {
          id: "new-id",
          studentId: "s1",
          classId: "c1",
          date: "2026-03-18",
          status: "PRESENT",
          createdAt: "2026-03-18T10:00:00Z",
        },
      },
    });

    const result = await submitAttendance({
      studentId: "s1",
      classId: "c1",
      date: "2026-03-18",
      status: "PRESENT" as any,
    });

    expect(result.data!.id).toBe("new-id");
    expect(result.error).toBeNull();

    const callArgs = mockGraphql.mock.calls[0][0];
    expect(callArgs.variables.input).toEqual({
      studentId: "s1",
      classId: "c1",
      date: "2026-03-18",
      status: "PRESENT",
    });
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce({ message: "DynamoDB error" });

    const result = await submitAttendance({
      studentId: "s1",
      classId: "c1",
      date: "2026-03-18",
      status: "ABSENT" as any,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe("DynamoDB error");
  });
});

// ─── changeAttendance ───────────────────────────────────────

describe("changeAttendance", () => {
  it("updates an existing attendance record status", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        updateAttendance: {
          id: "a1",
          studentId: "s1",
          classId: "c1",
          date: "2026-03-18",
          status: "LATE",
          createdAt: "2026-03-18T10:00:00Z",
        },
      },
    });

    const result = await changeAttendance({ id: "a1", status: "LATE" as any });

    expect(result.data!.status).toBe("LATE");
    expect(result.error).toBeNull();

    const callArgs = mockGraphql.mock.calls[0][0];
    expect(callArgs.variables.input).toEqual({ id: "a1", status: "LATE" });
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce(new Error("Update failed"));

    const result = await changeAttendance({ id: "a1", status: "PRESENT" as any });

    expect(result.data).toBeNull();
    expect(result.error).toBe("Update failed");
  });
});
