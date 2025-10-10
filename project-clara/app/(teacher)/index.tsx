import { Href, useRouter } from "expo-router";
import { StyleSheet, View, FlatList } from "react-native";

import Card from "@/components/Card";
import { Colors } from "@/constants/theme";

export default function Index() {
    const router = useRouter();

    // list used for making cards with the flat view. this will be done dynamically later
    const CardFlatListData = [
        {
            id: 1,
            header: 'Clickable Test Card',
            preview: 'Hello! Click me! I send you to the class screen',
            route: '/class',
        },
        {
            id: 2,
            header: 'Clickable Test Card',
            preview: 'Click to go to messaging screen',
            route: '/messaging',
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
        alignContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
});