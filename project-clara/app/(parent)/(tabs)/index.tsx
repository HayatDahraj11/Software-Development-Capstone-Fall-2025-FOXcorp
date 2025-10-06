import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import Card from "@/components/Card";

export default function Index() {
    const router = useRouter();
    
    const onCardPress = () => {
        {/* test function with preset link, real cards will have link dynamically provided */}
        router.push("/(parent)/(tabs)/live-updates");
    };


    return (
        <View style={styles.container}>
            <Card header="Clickable Test Card" preview="Hello! I am testing this forever!! AAAAAAAAAAAA AHH AHH AHH IM BURNING" onPress={onCardPress}/>
            <Card header="Test Card" preview="Hello! I am testing this forever!! AAAAAAAwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwAAAAA AHH AHH AHH IM BURNING"/>
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