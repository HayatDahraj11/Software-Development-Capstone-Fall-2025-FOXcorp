import { useState, useEffect, useMemo } from "react";
import { fetchSchoolsFromRepo, SchoolItem } from "../api/schoolRepo";

export type { SchoolItem };

interface UseSchoolSelectionReturn {
    schools: SchoolItem[];
    loading: boolean;
    search: string;
    setSearch: (value: string) => void;
    error: string | null;
}

export function useSchoolSelection(): UseSchoolSelectionReturn {
    const [fullList, setFullList] = useState<SchoolItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSchools() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchSchoolsFromRepo();
                if (isMounted) {
                    setFullList(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Failed to load schools");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadSchools();

        return () => {
            isMounted = false;
        };
    }, []);

    const schools = useMemo(() => {
        if (search === "") {
            return fullList;
        }

        const lowerCaseSearch = search.toLowerCase();
        return fullList.filter((item) =>
            item.name.toLowerCase().includes(lowerCaseSearch)
        );
    }, [search, fullList]);

    return {
        schools,
        loading,
        search,
        setSearch,
        error,
    };
}
