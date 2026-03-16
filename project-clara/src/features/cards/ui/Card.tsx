import Ionicons from "@expo/vector-icons/Ionicons";
import { ColorValue, Pressable, StyleSheet, Text, View } from "react-native";
import { badgeStyle } from "../../app-themes/constants/stylesheets";

import { useThemeColor } from "../../app-themes/logic/use-theme-color";

{/* Card will take in a header string, a preview string, 
    and optionally take in an onPress function and an 
    urgency boolean */}

// for cards with badges, will they display text or a number?
// cards with badges are always urgent!
enum BadgeType { TextBadge, NumberBadge }

type Props = {
    header: string;
    preview: string;
    onPress: () => void; 
    theme?: string;
    urgent?: boolean; // urgent should come with a badge!
    pressable?: boolean; // will add a chevron to the right of a card if this is true
    icon?: {name: keyof typeof Ionicons.glyphMap, size: number, color: ColorValue, backgroundColor: string} // details for an ionicons icon
    badge?: {type: BadgeType, content: string, contentColor: ColorValue, backgroundColor: ColorValue} // a badge, normally denoting something important

};


export default function Card({header, preview, onPress, theme, urgent, pressable, icon, badge}: Props) {
    // loading colors in runtime based on app theme (dark/light)
    const cardbgcolor = useThemeColor({}, "cardBackground");
    const textcolor = useThemeColor({}, "text");
    const urgentcolor = useThemeColor({}, "urgent");
    const listbordertransluscentcolor = useThemeColor({}, "listBorderTranslucent");
    const listtextcolor = useThemeColor({}, "listText");
    const chevroncolor = useThemeColor({}, "placeholderText")

    // a card which displays as a short, one-line item in a list
    // does not need a preview, will display it only if urgent
    if(theme === "list") {
       return (
            <View style={[styles.listItem, {borderBottomColor: listbordertransluscentcolor}]}>
                <Pressable onPress={onPress}>
                    {preview !== "" ? (
                        urgent ? (
                            <Text style={[styles.listText, { color: listtextcolor }]}>
                                <Text style={[styles.listText, { color: listtextcolor }]}>{header}{'\n'}</Text>
                                <Text style={[styles.listPreviewUrgentText, { color: urgentcolor }]}>{preview}</Text>
                            </Text>
                        ) : (
                            <Text style={[styles.listText, { color: listtextcolor }]}>
                                <Text style={[styles.listText, { color: listtextcolor }]}>{header}{"\n"}</Text>
                                <Text style={[styles.listPreviewTest, { color: listtextcolor }]}>{preview}</Text>
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
            <View style={[styles.card, {backgroundColor: cardbgcolor}]}>
                <Pressable onPress={onPress}>
                    {preview !== "" ? ( 
                    // cards with preview text
                        urgent ? ( 
                        // if "urgent" is true
                            badge ? (
                            // if there was a badge passed in
                                icon ? (
                                // if tehre was an icon passed in
                                    <View style={styles.cardRow}>
                                        <View style={[styles.icon, {backgroundColor: icon.backgroundColor}]}>
                                            <Ionicons name={icon.name} size={icon.size} color={icon.color} />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                            <Text style={[styles.preview, {color: textcolor}]}>{preview}</Text>
                                        </View>
                                        {badge.type === 0 ? ( // badge type "TextBadge"
                                            <View style={[badgeStyle.badge, {backgroundColor: badge.backgroundColor}]}>
                                                <Text style={[badgeStyle.badgeText, {color: badge.contentColor}]}>
                                                    {badge.content}
                                                </Text>
                                            </View>
                                        ) : ( // badge type "NumberBadge"
                                            <View style={[badgeStyle.countBadge, {backgroundColor: badge.backgroundColor}]}>
                                                <Text style={[badgeStyle.badgeText, {color: badge.contentColor}]}>
                                                    {badge.content}
                                                </Text>
                                            </View>
                                        )}
                                        {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                    </View>
                                ) : (
                                // if there wasn't an icon passed in
                                    <View style={styles.cardRow}>
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                            <Text style={[styles.preview, {color: textcolor}]}>{preview}</Text>
                                        </View>
                                        {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                    </View>
                                )
                            ) : (
                            // if there was no badge passed in (this will use the old way of displaying urgent info!)
                                icon ? (
                                // if there is an icon passed in
                                    <View style={[styles.urgentContainer]}>
                                        <View style={[styles.urgentFlag, {backgroundColor: urgentcolor}]}></View>
                                        <View style={styles.cardRow}>
                                            <View style={[styles.icon, {backgroundColor: icon.backgroundColor}]}>
                                                <Ionicons name={icon.name} size={icon.size} color={icon.color} />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                                <Text style={[styles.preview, {color: textcolor}]}>{preview}</Text>
                                            </View>
                                            {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                        </View>
                                    </View>
                                ) : (
                                // if there isnt an icon passed in
                                    <View style={[styles.urgentContainer]}>
                                        <View style={[styles.urgentFlag, {backgroundColor: urgentcolor}]}></View>
                                        <View style={styles.cardRow}>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                                <Text style={[styles.preview, {color: textcolor}]}>{preview}</Text>
                                            </View>
                                            {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                        </View>
                                    </View>
                                )
                            )
                        ) : ( 
                        // if "urgent" is false/undef
                            icon ? (
                            // if there's an icon passed in
                                <View style={styles.cardRow}>
                                    <View style={[styles.icon, {backgroundColor: icon.backgroundColor}]}>
                                        <Ionicons name={icon.name} size={icon.size} color={icon.color} />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                        <Text style={[styles.preview, {color: textcolor}]}>{preview}</Text>
                                    </View>
                                    {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                </View>
                            ) : (
                            // if there isn't an icon passed in
                                <View style={styles.cardRow}>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                        <Text style={[styles.preview, {color: textcolor}]}>{preview}</Text>
                                    </View>
                                    {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                </View>
                            )
                        )
                    ) : ( 
                    // cards without preview text
                        urgent ? ( 
                        // if "urgent" is true
                        badge ? (
                            // if there was a badge passed in
                                icon ? (
                                // if tehre was an icon passed in
                                    <View style={styles.cardRow}>
                                        <View style={[styles.icon, {backgroundColor: icon.backgroundColor}]}>
                                            <Ionicons name={icon.name} size={icon.size} color={icon.color} />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                        </View>
                                        {badge.type === 0 ? ( // badge type "TextBadge"
                                            <View style={[badgeStyle.badge, {backgroundColor: badge.backgroundColor}]}>
                                                <Text style={[badgeStyle.badgeText, {color: badge.contentColor}]}>
                                                    {badge.content}
                                                </Text>
                                            </View>
                                        ) : ( // badge type "NumberBadge"
                                            <View style={[badgeStyle.countBadge, {backgroundColor: badge.backgroundColor}]}>
                                                <Text style={[badgeStyle.badgeText, {color: badge.contentColor}]}>
                                                    {badge.content}
                                                </Text>
                                            </View>
                                        )}   
                                        {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                    </View>
                                ) : (
                                // if there wasn't an icon passed in
                                    <View style={styles.cardRow}>
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                        </View>
                                        {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)} 
                                    </View>
                                )
                            ) : (
                            // if there was no badge passed in (this will use the old way of displaying urgent info!)
                                icon ? (
                                // if there is an icon passed in
                                    <View style={[styles.urgentContainer]}>
                                        <View style={[styles.urgentFlag, {backgroundColor: urgentcolor}]}></View>
                                        <View style={styles.cardRow}>
                                            <View style={[styles.icon, {backgroundColor: icon.backgroundColor}]}>
                                                <Ionicons name={icon.name} size={icon.size} color={icon.color} />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                            </View>
                                            {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                        </View>
                                    </View>
                                ) : (
                                // if there isnt an icon passed in
                                    <View style={[styles.urgentContainer]}>
                                        <View style={[styles.urgentFlag, {backgroundColor: urgentcolor}]}></View>
                                        <View style={styles.cardRow}>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                            </View>
                                            {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                        </View>
                                    </View>
                                )
                            )
                        ) : ( 
                        // if "urgent" is false/undef
                            icon ? (
                            // if there's an icon passed in
                                <View style={styles.cardRow}>
                                    <View style={[styles.icon, {backgroundColor: icon.backgroundColor}]}>
                                        <Ionicons name={icon.name} size={icon.size} color={icon.color} />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                    </View>
                                    {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                </View>
                            ) : (
                            // if there isn't an icon passed in
                                <View style={styles.cardRow}>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.header, {color: textcolor}]}>{header}</Text>
                                    </View>
                                    {pressable && (<Ionicons name="chevron-forward" size={18} color={chevroncolor} />)}
                                </View>
                            )
                        )
                    )}
                </Pressable>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    // the default card style, a roundrect container
    card: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    cardContent: {
        flex: 1,
    },
    header: {
        fontSize: 16,
        fontWeight: "600",
    },
    preview: {
        fontSize: 13,
        marginTop: 2,
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
    },
    icon: { // if there is an icon within the card
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
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
        borderTopColor: 'rgba(29, 41, 57, 0)',
    },
    listText: {
        fontSize: 16,
        fontWeight: "bold",
        padding: 3,
        textAlign: 'left',
    },
    listPreviewTest: {
        fontSize: 14,
        fontWeight: "normal",
        padding: 3,
        textAlign: 'left',
    },
    listPreviewUrgentText: {
        fontSize: 14,
        fontWeight: "normal",
        padding: 3,
        textAlign: 'left',
    }
})