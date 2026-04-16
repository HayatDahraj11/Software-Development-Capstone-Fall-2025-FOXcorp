import { Progress } from "@/src/rnreusables/ui/progress";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { containerStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";



export default function Index() {
    const router = useRouter();
    const [isAllDone, setIsAllDone] = useState(false);
    const [isContextDone, setIsContextDone] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    const bgcolor = useThemeColor({}, "background")
    const tint = useThemeColor({}, "tint");

    const {
            isContextLoading,
            isDebug,
            userTeacher,
            userClasses,
            onSignIn,
      } = useTeacherLoginContext();

    useEffect(() => {
        const startup = async () => {
            setProgress(10)
            await onSignIn();   
            setProgress(50);
            setIsContextDone(true);
        };
        startup();
    }, []);

    const finalize = useCallback(() => {
        if (!isContextLoading && isContextDone) {
            setProgress(90);
            console.log(`Teacher onSignIn() done:
                debug?: ${isDebug}
                userId: ${userTeacher.userId}
                name: ${userTeacher.name}
                classes: ${userClasses.length}`);
            setIsAllDone(true);
        }
    }, [isContextDone, isContextLoading]);

    useEffect(() => {
        finalize();
    }, [finalize]);

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
});

    if (!isAllDone) {
        return (
            <View style={{justifyContent: "center", alignContent: "center", flex: 1}}>
                <Progress value={progress} className="w-3/4 md:w-[60%]" style={{marginHorizontal: 22}}/>
            </View>
        )
    }

    // list used for making cards with the flat view. this will be done dynamically later
    const CardFlatListData = userClasses.map((cls) => ({
        id: cls.id,
        header: cls.name,
        preview: ``,
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
        <View style={[containerStyle.container, {backgroundColor: bgcolor}]}>
            <FlatList
                contentContainerStyle={containerStyle.scrollContent}
                data={CardFlatListData}
                renderItem={({ item }) => (
                    <Card
                        header={item.header}
                        preview={item.preview}
                        onPress={() => RouteCard(item.route)}
                        pressable={true}
                        icon={{
                            name: "school",
                            size: 22,
                            color: tint,
                            backgroundColor: tint + "20",
                        }}
                    />
                )}
            />
        </View>
    );
}

