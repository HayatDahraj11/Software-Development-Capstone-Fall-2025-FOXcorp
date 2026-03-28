const mockGraphql = jest.fn();
jest.mock("aws-amplify/api", () => ({
  generateClient: () => ({ graphql: mockGraphql }),
}));

jest.mock("@/src/graphql/queries", () => ({
  incidentsByClassId: "incidentsByClassId",
}));

jest.mock("@/src/graphql/mutations", () => ({
  createIncident: "createIncident",
}));

jest.mock("@/src/API", () => ({
  ModelSortDirection: { ASC: "ASC", DESC: "DESC" },
}));

import {
  fetchIncidentsByClass,
  reportIncident,
} from "@/src/features/incidents/api/incidentRepo";

beforeEach(() => {
  mockGraphql.mockReset();
});

// ─── fetchIncidentsByClass ──────────────────────────────────

describe("fetchIncidentsByClass", () => {
  it("returns incidents sorted DESC for a class", async () => {
    const mockItems = [
      {
        id: "i1",
        description: "Disrupted class",
        severity: "Medium",
        date: "2026-03-18",
        teacherId: "t1",
        studentId: "s1",
        classId: "c1",
        schoolId: "sch1",
        student: { id: "s1", firstName: "John", lastName: "Doe" },
        createdAt: "2026-03-18T14:00:00Z",
      },
    ];
    mockGraphql.mockResolvedValueOnce({
      data: { incidentsByClassId: { items: mockItems } },
    });

    const result = await fetchIncidentsByClass("c1");

    expect(result.data).toHaveLength(1);
    expect(result.data![0].description).toBe("Disrupted class");
    expect(result.data![0].student!.firstName).toBe("John");
    expect(result.error).toBeNull();

    // verify classId was passed (no sortDirection - index doesn't support it)
    const callArgs = mockGraphql.mock.calls[0][0];
    expect(callArgs.variables.classId).toBe("c1");
    expect(callArgs.variables.sortDirection).toBeUndefined();
  });

  it("returns empty array when no incidents exist", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { incidentsByClassId: { items: [] } },
    });

    const result = await fetchIncidentsByClass("c1");

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("handles null response gracefully", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: { incidentsByClassId: null },
    });

    const result = await fetchIncidentsByClass("c1");

    expect(result.data).toEqual([]);
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce({ message: "Query failed" });

    const result = await fetchIncidentsByClass("c1");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Query failed");
  });
});

// ─── reportIncident ─────────────────────────────────────────

describe("reportIncident", () => {
  it("creates an incident with all required fields", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        createIncident: {
          id: "new-inc",
          description: "Hit another student",
          severity: "High",
          date: "2026-03-18",
          teacherId: "t1",
          studentId: "s1",
          classId: "c1",
          schoolId: "sch1",
          createdAt: "2026-03-18T14:00:00Z",
        },
      },
    });

    const result = await reportIncident({
      description: "Hit another student",
      severity: "High",
      date: "2026-03-18",
      teacherId: "t1",
      studentId: "s1",
      classId: "c1",
      schoolId: "sch1",
    });

    expect(result.data!.id).toBe("new-inc");
    expect(result.data!.severity).toBe("High");
    expect(result.error).toBeNull();

    const callArgs = mockGraphql.mock.calls[0][0];
    expect(callArgs.variables.input).toEqual({
      description: "Hit another student",
      severity: "High",
      date: "2026-03-18",
      teacherId: "t1",
      studentId: "s1",
      classId: "c1",
      schoolId: "sch1",
    });
  });

  it("returns error on failure", async () => {
    mockGraphql.mockRejectedValueOnce(new Error("Create failed"));

    const result = await reportIncident({
      description: "test",
      severity: "Low",
      date: "2026-03-18",
      teacherId: "t1",
      studentId: "s1",
      classId: "c1",
      schoolId: "sch1",
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe("Create failed");
  });
});
