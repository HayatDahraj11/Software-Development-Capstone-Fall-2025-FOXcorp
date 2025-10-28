import Card from "./Card";

import { Colors } from "@/constants/theme";

{/* Uses the Card component
    You pass in the student's class list name string array,
    the student's attendance rate,
    and dynamic paths to the student's schedule href, records href,
    and documentation href
     */}

type Props = {
    classList: string[];
    attendanceRate: number;
    schedulePath: string;
    recordsPath: string;
    documentationPath: string;
};