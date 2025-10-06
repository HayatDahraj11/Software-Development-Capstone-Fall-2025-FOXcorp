import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

{/* Card will take in a header string, a preview string, 
    and optionally take in an onPress function and an 
    urgency boolean */}

type Props = {
    header: string;
    preview: string;
    onPress?: () => void; 
    urgent?: boolean;
};


export default function Card({header, preview, onPress, urgent}: Props) {
    
    if(onPress) { 
        return (
        <View style={styles.card}>
            <Pressable onPress={onPress}>
                <Text style={styles.header}>{header}</Text>
                <Text style={styles.preview}>{preview}</Text>
            </Pressable>
        </View>
    )
    }
    return (
        <View style={styles.card}>
            <Text style={styles.header}>{header}</Text>
            <Text style={styles.preview}>{preview}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    card: {
        flex: 1/6,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        padding: 15,
        margin: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden',
    },
    header: {
        color: Colors.light.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    preview: {
        color: Colors.light.text,
        fontSize: 16,
    },
})