import { useCallback, useState } from "react";
import { fetchTeacherWithClass, Teacher, Class } from "../api/teacher_data_fetcher";
import { Class, Enrollment, fetchClassesForStudents, fetchParentWithKids, fetchTeacherByID, Parent, Student, Teacher_parentSide } from "../api/parent_data_fetcher";


interface UseParentUserDataReturn {
    isLoading: boolean; // true while functions are doing work and should not be interrupted
    parent: Parent | undefined;
    students: Student[] | undefined;
    classes: Class[] | undefined;
    enrollments: Enrollment[] | undefined;
    teachers_parentSide: Teacher_parentSide[] | undefined; // teacher information that the parent cares about, undefined for other login types
    handleParentAndStudentData: () => Promise<boolean>;
    handleClassDataforParent: () => Promise<boolean>;
    handleTeacherDataforParent: (teacherids: string[]) => Promise<boolean>;
}

export function useParentUserData(): UseParentUserDataReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [parent, setParent] = useState<Parent>();
    const [students, setStudents] = useState<Student[]>();
    const [classes, setClasses] = useState<Class[]>();
    const [enrollments, setEnrollments] = useState<Enrollment[]>();
    const [teachers_parentSide, setTeachers_parentSide] = useState<Teacher_parentSide[]>();

    // returns true on success, false on failure
    const handleParentAndStudentData = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);

        try {
            const data = await fetchParentWithKids();
            if(!data.success) {
                throw new Error(data.message);
            } else if(data.parent && data.students) {
                //console.log(data.parent.firstName);
                //console.log(data.students[0].firstName);
                setParent(data.parent);
                setStudents(data.students);
                console.log("Parent and student data grabbed and saved successfully!");
                return true;
            } else {
                throw new Error("Somehow, data came back as a success with no parent or student data attached?");
            }

        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useParentUserData.ts, handleParentAndStudentData: ", err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleClassDataforParent = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);

        try{
            const data = await fetchClassesForStudents();
            if(!data.success) {
                throw new Error(data.message);
            } else if(data.enrollments && data.classes) {
                setClasses(data.classes);
                setEnrollments(data.enrollments);
                console.log("Classes and enrollment data grabbed and saved successfully!");
                return true;
            } else {
                throw new Error("Somehow, data came back as a success with no class or enrollment data attached?");
            }
        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useUserData.ts, handleClassDataforParent: ", err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleTeacherDataforParent = useCallback(async (teacherids: string[]): Promise<boolean> => {
        setIsLoading(true);

        try{
            // this one is structured a lil differently
                // instead of grabbing all related stuff at once, it grabs each teacher one at a time
                // this is just a reality of how i structured it. can be changed later, i guess.
            let tempteacharr: Teacher_parentSide[] = []
            for(const i of teacherids) {
                const data = await fetchTeacherByID(i);
                if(!data.success) {
                    throw new Error(data.message);
                } else if(data.teacher) {
                    //setTeacher_parentSide(data.teacher);
                    //console.log("Teacher data grabbed and save successfully!");
                    tempteacharr.push(data.teacher);
                } else {
                    throw new Error("Somehow, data came back as a success with no teacher data attached?")
                }
            }

            setTeachers_parentSide(tempteacharr);
            return true;
        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useUserData.ts, handleTeacherDataforParent: ", err.message);
            return false;

        } finally {
            setIsLoading(false);
        }
    }, [])

    return {
        isLoading,
        parent,
        students,
        classes,
        enrollments,
        teachers_parentSide,
        handleParentAndStudentData,
        handleClassDataforParent,
        handleTeacherDataforParent,
    }
}