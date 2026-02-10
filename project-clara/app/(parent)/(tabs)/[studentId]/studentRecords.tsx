import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";

import Card from "@/src/features/cards/ui/Card";

export default function StudentRecordsScreen() {
    // context given parent and student data
    const {
        userStudents,
    } = useParentLoginContext();
    
    const { studentId } = useLocalSearchParams();
    const student = userStudents.find(item => item.id === studentId); // grabbing the student we are passed in
    const router = useRouter();

    const RouteCard = (route: string): void => {
            // if card has a route, use it. if not, ignore it
            if(route !== " ") { 
                router.push( (route) as Href );
            }
            else { }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.listContainer}>
                <Card header="Attendance" preview="" onPress={() => RouteCard(" ")} theme="list"/>
                <Card header="Medical" preview="School needs updated vaccine records for your child!" onPress={() => RouteCard(" ")} theme="list" urgent={true}/>
                <Card header="Transcript" preview="" onPress={() => RouteCard(" ")} theme="list"/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginTop: 10,
        gap: 0,
    },
});