import { sendPushNotification, usePushNotifications } from "@/src/features/notifications/logic/usePushNotifications";
import { Href, useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";

export default function ParentHomeScreen() {
    const {expoPushToken, notification} = usePushNotifications();
    console.log("EXPO PUSH TOKEN: ",expoPushToken);

    const router = useRouter();

    // list used for making cards with the flat view. this will be done dynamically later
    const CardFlatListData = [
        {
            id: 1,
            header: 'Clickable Test Card',
            preview: 'Hello! Click me bruh! I send you to live updates!',
            route: '/(parent)/(tabs)/live-updates',
        },
        {
            id: 2,
            header: 'Clickable Test Card',
            preview: 'Hello! Click me bruh! I send you to messages!',
            route: '/(parent)/(tabs)/messaging',
        },
        {
            id: 3,
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

    const LocalNotificationSender = (): void => {
        if(expoPushToken) {
            sendPushNotification(expoPushToken);
        } else {
            console.warn("Tried to send notification with no push token. What's up with that, man?")
        }
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: useThemeColor({}, "background"),
    },
});

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
            <Card
                header="Send Notification"
                preview="Sends notification that will route you somewhere else!"
                onPress={() => LocalNotificationSender()}>

            </Card>
        </View>
    );
}