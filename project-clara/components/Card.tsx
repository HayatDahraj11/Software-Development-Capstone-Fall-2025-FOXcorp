import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

{/* Card will take in a header string, a preview string, 
    and optionally take in an onPress function and an 
    urgency boolean */}

type Props = {
    header: string;
    preview: string;
    onPress: () => void; 
    theme?: string;
    urgent?: boolean;

};


export default function Card({header, preview, onPress, theme, urgent}: Props) {
    // a card which displays as a short, one-line item in a list
    // does not need a preview, will display it only if urgent
    if(theme === "list") {
       return (
            <View style={styles.listItem}>
                <Pressable onPress={onPress}>
                    {preview !== "" ? (
                        urgent ? (
                            <Text style={styles.listText}>
                                <Text style={styles.listText}>{header}{'\n'}</Text>
                                <Text style={styles.listPreviewUrgentText}>{preview}</Text>
                            </Text>
                        ) : (
                            <Text style={styles.listText}>
                                <Text style={styles.listText}>{header}{"\n"}</Text>
                                <Text style={styles.listPreviewTest}>{preview}</Text>
                            </Text>
                        )
                    ) : (
                        <Text style={styles.listText}>{header}</Text>
                    )}
                </Pressable>
            </View>
       )
       
    }
    // default card theme
    else {
        return (
            <View style={styles.card}>
                <Pressable onPress={onPress}>
                    {preview !== "" ? (
                        <Text>
                            <Text style={styles.header}>{header}{'\n'}</Text>
                            <Text style={styles.preview}>{preview}</Text>
                        </Text>
                    ) : (
                        <Text style={styles.header}>{header}</Text>
                    )}
                </Pressable>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    // the default card style, a roundrect container
    card: {
        flex: 1/6,
        backgroundColor: '#f5f5f5ff',
        borderRadius: 10,
        padding: 15,
        margin: 8,
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
        fontWeight: 'normal',
        fontSize: 16,
    },

    // the "list" card style, a smaller container meant to be displayed in a compact list
    listItem: { 
        flex: 1/8,
        padding: 4,
        borderWidth: 1,
        borderRadius: 3,
        borderLeftColor: 'rgba(0,0,0,0)',
        borderRightColor: 'rgba(0,0,0,0)',
        borderBottomColor: 'rgba(29, 41, 57, 0.25)',
        borderTopColor: 'rgba(29, 41, 57, 0)',
    },
    listText: {
        fontSize: 16,
        fontWeight: "bold",
        padding: 3,
        color: '#1D2939',
        textAlign: 'left',
    },
    listPreviewTest: {
        fontSize: 14,
        fontWeight: "normal",
        padding: 3,
        color: '#1D2939',
        textAlign: 'left',
    },
    listPreviewUrgentText: {
        fontSize: 14,
        fontWeight: "normal",
        padding: 3,
        color: '#ec5557ff',
        textAlign: 'left',
    }
})