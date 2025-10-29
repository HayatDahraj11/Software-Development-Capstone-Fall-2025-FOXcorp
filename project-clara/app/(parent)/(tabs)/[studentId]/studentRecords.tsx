import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Href } from "expo-router";

import Card from "@/components/Card";

export default function StudentRecordsScreen() {
    const { studentId } = useLocalSearchParams();
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