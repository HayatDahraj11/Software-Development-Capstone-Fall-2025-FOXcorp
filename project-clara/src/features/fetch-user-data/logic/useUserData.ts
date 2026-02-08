import { useCallback, useState } from "react";
import { fetchParentWithKids, Parent, Student } from "../api/parent_data_fetcher";


interface UseUserDataReturn {
    isLoading: boolean; // true while functions are doing work and should not be interrupted
    parent: Parent | undefined;
    students: Student[] | undefined;
    handleParentAndStudentData: () => Promise<boolean>;
}

export function useUserData(): UseUserDataReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [parent, setParent] = useState<Parent>();
    const [students, setStudents] = useState<Student[]>();

    // returns true on success, false on failure
    const handleParentAndStudentData = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);

        try {
            const data = await fetchParentWithKids();
            if(data.success) {
                throw new Error(data.message);
            } else if(data.parent && data.students) {
                setParent(data.parent);
                setStudents(data.students);
                console.log("Parent and student data grabbed and saved successfully!");
                return true;
            } else {
                throw new Error("Somehow, data came back as a success with no parent or student data attached?");
            }

        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useUserData.ts, handleParentAndStudentData: ", err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [])

    return {
        isLoading,
        parent,
        students,
        handleParentAndStudentData,
    }
}