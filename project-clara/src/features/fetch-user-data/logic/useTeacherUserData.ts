import { useCallback, useState } from "react";
import { fetchTeacherWithClass, Teacher, Class } from "../api/teacher_data_fetcher";


interface UseTeacherUserDataReturn {
    isLoading: boolean; // true while functions are doing work and should not be interrupted
    teacher: Teacher | undefined;
    classes: Class[] | undefined;

    handleTeacherAndClassData: () => Promise<boolean>;
}

export function useTeacherUserData(): UseTeacherUserDataReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [teacher, setTeacher] = useState<Teacher>();
    const [classes, setClasses] = useState<Class[]>();

    // returns true on success, false on failure
    const handleTeacherAndClassData = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);

        try {
            const data = await fetchTeacherWithClass();
            if(!data.success) {
                throw new Error(data.message);
            } else if(data.teacher && data.classes) {
                console.log(data.teacher.name);
                console.log(data.classes[0].name);
                setTeacher(data.teacher);
                setClasses(data.classes);
                console.log("Teacher and class data grabbed and saved successfully!");
                return true;
            } else {
                throw new Error("Somehow, data came back as a success with no teacher or class data attached?");
            }

        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useTeacherUserData.ts, handleTeacherAndClassData: ", err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [])

    return {
        isLoading,
        teacher,
        classes,
        handleTeacherAndClassData,
    }
}