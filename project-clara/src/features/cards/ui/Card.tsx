import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "../../app-themes/logic/use-theme-color";

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
    // styles are made in-function so they can use the theme stuff
    const styles = StyleSheet.create({
        // the default card style, a roundrect container
        card: {
            flex: 1/6,
            backgroundColor: useThemeColor({}, "cardBackground"),
            borderRadius: 10,
            padding: 15,
            margin: 8,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflow: 'hidden',
        },
        header: {
            color: useThemeColor({}, "text"),
            fontSize: 18,
            fontWeight: 'bold',
        },
        preview: {
            color: useThemeColor({}, "text"),
            fontWeight: 'normal',
            fontSize: 16,
        },
        urgentContainer: {
            flexDirection: 'row',
            marginHorizontal: -18,
        },
        urgentFlag: {
            width: '2%',
            height: '100%',
            marginRight: 8,
            borderRadius: 20,
            backgroundColor: useThemeColor({}, "urgent"),
        },

        // the "list" card style, a smaller container meant to be displayed in a compact list
        listItem: { 
            flex: 1/8,
            paddingHorizontal: 4,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 3,
            borderLeftColor: 'rgba(0,0,0,0)',
            borderRightColor: 'rgba(0,0,0,0)',
            borderBottomColor: useThemeColor({}, "listBorderTranslucent"),
            borderTopColor: 'rgba(29, 41, 57, 0)',
        },
        listText: {
            fontSize: 16,
            fontWeight: "bold",
            padding: 3,
            color: useThemeColor({}, "listText"),
            textAlign: 'left',
        },
        listPreviewTest: {
            fontSize: 14,
            fontWeight: "normal",
            padding: 3,
            color: useThemeColor({}, "listText"),
            textAlign: 'left',
        },
        listPreviewUrgentText: {
            fontSize: 14,
            fontWeight: "normal",
            padding: 3,
            color: useThemeColor({}, "urgent"),
            textAlign: 'left',
        }
    })



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
                            // cards without preview text
                        urgent ? ( 
                                // if "urgent" is true
                            <View style={styles.urgentContainer}>
                                <View style={styles.urgentFlag}></View>
                                <Text>
                                    <Text style={styles.header}>{header}{'\n'}</Text>
                                    <Text style={styles.preview}>{preview}</Text>
                                </Text>
                            </View>
                        ) : ( 
                            // if "urgent" is false/undef
                        <Text>
                            <Text style={styles.header}>{header}{'\n'}</Text>
                            <Text style={styles.preview}>{preview}</Text>
                        </Text>
                        )
                    ) : ( 
                        // cards with preview text
                        urgent ? ( 
                                // if "urgent" is true
                            <View style={styles.urgentContainer}>
                                <View style={styles.urgentFlag}></View>
                                <Text>
                                    <Text style={styles.header}>{header}</Text>
                                </Text>
                            </View>
                        ) : ( 
                                // if "urgent" is false/undef
                            <Text style={styles.header}>{header}</Text>
                        )
                    )}
                </Pressable>
            </View>
        )
    }
}


