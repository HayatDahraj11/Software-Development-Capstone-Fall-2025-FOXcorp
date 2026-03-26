const mockGraphql = jest.fn();
jest.mock("aws-amplify/api", () => ({
  generateClient: () => ({ graphql: mockGraphql }),
}));

jest.mock("@/src/graphql/queries", () => ({
  schedulesByClassId: "schedulesByClassId",
}));

import { fetchSchedulesByClass } from "@/src/features/schedules/api/scheduleRepo";

beforeEach(() => {
  mockGraphql.mockReset();
});

describe("fetchSchedulesByClass", () => {
  it("returns schedules for a class", async () => {
    const mockItems = [
      {
        id: "sch1",
        classId: "c1",
        dayOfWeek: "MONDAY",
        startTime: "09:00:00",
        endTime: "10:30:00",
        createdAt: "2026-03-01T00:00:00Z",
      },
      {
        id: "sch2",
        classId: "c1",
        dayOfWeek: "WEDNESDAY",
        startTime: "09:00:00",
        endTime: "10:30:00",
        createdAt: "2026-03-01T00:00:00Z",
      },
    ];
    mockGraphql.mockResolvedValueOnce({
      data: { schedulesByClassId: { items: mockItems } },
    });

    const result = await fetchSchedulesByClass("c1");

    expect(result.data).toHaveLength(2);
    expect(result.data![0].dayOfWeek).toBe("MONDAY");
    expect(result.data![0].startTime).toBe("09:00:00");
    expect(result.data![1].dayOfWeek).toBe("WEDNESDAY");
    expect(result.error).toBeNull();
  });

  it("returns empty array when no schedules exist", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { schedulesByClassId: { items: [] } },
    });

    const result = await fetchSchedulesByClass("c1");

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("handles null response gracefully", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { schedulesByClassId: null },
    });

    const result = await fetchSchedulesByClass("c1");

    expect(result.data).toEqual([]);
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce({ message: "Failed to fetch" });

    const result = await fetchSchedulesByClass("c1");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Failed to fetch");
  });

  it("passes classId correctly to GraphQL", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { schedulesByClassId: { items: [] } },
    });

    await fetchSchedulesByClass("my-class-id");

    expect(mockGraphql).toHaveBeenCalledWith({
      query: "schedulesByClassId",
      variables: { classId: "my-class-id" },
    });
  });
});
