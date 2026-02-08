import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";

import Card from "@/src/features/cards/ui/Card";

export default function StudentDocumentationScreen() {
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
                <Card header="Emergency Contacts" preview={`View and Edit ${student?.firstName}'s Contacts`} onPress={() => RouteCard(" ")} theme="list"/>
                <Card header="Behavioral Records" preview="" onPress={() => RouteCard(" ")} theme="list"/>
                <Card header="Teacher Notes" preview="There are notes to be read!" onPress={() => RouteCard(" ")} theme="list" urgent={true}/>
                <Card header="Accomodations" preview="" onPress={() => RouteCard(" ")} theme="list"/>
                <Card header="Psych-Evals" preview="" onPress={() => RouteCard(" ")} theme="list"/>
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
    },
});