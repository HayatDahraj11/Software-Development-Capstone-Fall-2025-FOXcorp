import { Href, Redirect, useRouter } from "expo-router";
import { StyleSheet, View, FlatList } from "react-native";


export default function Index() {
    return (
        <Redirect href="/(parent)/(tabs)/home"/>
    );
}

