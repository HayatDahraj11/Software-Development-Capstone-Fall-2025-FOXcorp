// this is a popup modal which displays information about a given class
// given the classId and the studentId
// currently, this modal is designed before we have the backend role stuff set up
// when we have the backend ready, information about the class will be pulled based on class and student Id
// for now, this is static
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from '@/src/rnreusables/ui/avatar';
import { containerStyle } from "../../app-themes/constants/stylesheets";
import { useThemeColor } from "../../app-themes/logic/use-theme-color";


type Props = {
    // pass up these primitives to avoid having to parse class/teacher/enrollment objects
    // instead, only get the id's and let other parts of the app do the hardwork with those ids
    classId: string;
    className: string;
    teacherId: string;
    teacherName: string;
    studentGrade: number;
    onClickProfilePic: (teacherId: string) => void; // teacher's pfp is clickable, routes to messages for teacher
};

const PlaceholderImage = require('@/assets/images/icon.png')

export default function Parent_ViewClassComponent({classId, className, teacherId, teacherName, studentGrade, onClickProfilePic}: Props) {
    
    const bgcolor = useThemeColor({}, "background");
    const cardbgcolor = useThemeColor({}, "cardBackground");
    const lightbackground = useThemeColor({}, "lightContrastBackground")
    const tabiconcolor = useThemeColor({}, "tabIconDefault");
    const textcolor = useThemeColor({}, "text");
    const tintcolor = useThemeColor({}, 'tint');
    const listtextcolor = useThemeColor({}, "listText");
    const subtextcolor = useThemeColor({}, "placeholderText");
    const modalbgcolor = useThemeColor({}, "modalBackground");


    return (
        <View style={styles.content}>
            <View style={styles.headerContainer}>
                <Text style={[styles.headerText, {color: textcolor}]}>{className}</Text>
                <Text style={[styles.headerText, {color: textcolor}]}>{`Grade: ${studentGrade}`}</Text>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor: lightbackground}]}>
                <Text style={[containerStyle.sectionLabel, {color: textcolor}]}>Teacher</Text>
                <View style={styles.rowContainer}>
                    <Text style={[styles.teacherText, {color: textcolor}]}>{teacherName}</Text>
                    <Pressable onPress={(teacherId) => onClickProfilePic}>
                        <Avatar alt={`${teacherName}'s Avatar`}>
                            <AvatarImage source={PlaceholderImage} />
                            <AvatarFallback>
                                <Text>!!</Text>
                            </AvatarFallback>
                        </Avatar>
                    </Pressable>
                </View>
            </View>
            <View style={[styles.sectionContainer]}>
                <Text style={[containerStyle.sectionLabel, {color: textcolor}]}>Announcements</Text>
                <Text style={[styles.teacherText, {color: textcolor}]}>tbd!</Text>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor: lightbackground}]}>
                <Text style={[containerStyle.sectionLabel, {color: textcolor}]}>{`Teacher's Notes`}</Text>
                <Text style={[styles.teacherText, {color: textcolor}]}>tbd!</Text>
            </View>
        </View>
    )
}
 
const styles = StyleSheet.create ({
    content: {
        justifyContent: 'space-around',
        flexDirection: 'column',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    headerText: {
        fontSize: 16,
        fontWeight: "600",
    },
    teacherText: {
        fontSize: 16,
        fontWeight: "400",
    },
    sectionContainer: {
        marginVertical: 12,
        padding: 6,
        borderRadius: 2,
        flexDirection: 'column',
    },

})