import { Href, useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import Card from "@/components/Card";
import { Colors } from "@/src/features/app-themes/logic/theme";

export default function attendanceList() {
  const router = useRouter();

  const CardFlatListData = [
        {
            id: 1,
            header: 'Clickable Test Card',
            preview: 'Student 1',
            route: '/(teacher)/(class)/modal',
        },
        {
            id: 2,
            header: 'Clickable Test Card',
            preview: 'Student 2',
            route: ' '
        },
        {
            id: 3,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 4,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 5,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 6,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 7,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 8,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 9,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 10,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
        {
            id: 11,
            header: 'Test Card',
            preview: 'I am not clickable!',
            route: ' ',
        },
    ];

    const RouteCard = (route: string): void => {
            // if card has a route, use it. if not, ignore it
            if(route !== " ") {
                router.push( (route) as Href );
            }
            else { }
        };

    return (
            <View style={styles.container}>
                <FlatList
                    data={CardFlatListData}
                    renderItem={({item, index}) => (
                        <Card
                            header={item.header}
                            preview={item.preview}
                            onPress={() => RouteCard(item.route)}
                        />
                    )}
                />
            </View>
        );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
});