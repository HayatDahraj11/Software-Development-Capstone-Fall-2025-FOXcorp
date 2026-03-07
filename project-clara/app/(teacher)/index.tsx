import { Href, useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

export default function Index() {
    const router = useRouter();

    const {
            userTeacher,
            userClasses,
      } = useTeacherLoginContext();

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: useThemeColor({}, "background")
    },
});

    // list used for making cards with the flat view. this will be done dynamically later
    const CardFlatListData = userClasses.map((cls) => ({
        id: cls.id,
        header: cls.name,
        preview: `Tap to view class`,
        route: `/class?classId=${cls.id}`,
    }));

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

