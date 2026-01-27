import { generateClient } from "aws-amplify/api";
import { listSchools } from "@/src/graphql/queries";
import type { School, ListSchoolsQuery } from "@/src/API";

export type SchoolItem = Pick<School, "id" | "name" | "address">;

const FALLBACK_SCHOOLS: SchoolItem[] = [
    { id: "1", name: "University of North Texas", address: null },
    { id: "2", name: "Texas Woman's University", address: null },
    { id: "3", name: "Pecan Creek Elementary", address: null },
    { id: "4", name: "Vancouver the city", address: null },
];

export async function fetchSchoolsFromRepo(): Promise<SchoolItem[]> {
    try {
        const client = generateClient();
        const response = await client.graphql({ query: listSchools });
        const data = response.data as ListSchoolsQuery;
        const items = data.listSchools?.items ?? [];

        const schools: SchoolItem[] = items
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .map((item) => ({
                id: item.id,
                name: item.name,
                address: item.address ?? null,
            }));

        return schools.length > 0 ? schools : FALLBACK_SCHOOLS;
    } catch (error) {
        console.error("Failed to fetch schools from API:", error);
        return FALLBACK_SCHOOLS;
    }
}
