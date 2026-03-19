// reusable stylesheets, sorted by which type of content they were made for
// all of these can be imported individually or as a group
// this is intended for a unified style!!
// this does not include colors as colors are chosen in runtime!
import { StyleSheet } from "react-native"


export const containerStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
      flex: 1/12,
      alignContent: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      paddingBottom: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    // label for section titles within a screen
    sectionLabel: { 
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    empty: {
        alignItems: "center", 
        paddingTop: 40,
    },
})

// the big thing on the home screen, first thing you see
export const homeScreenHeroStyle = StyleSheet.create({
    heroSection: {
        marginBottom: 24,
    },
    heroTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    greeting: {
        fontSize: 16,
        fontWeight: "400",
    },
    userName: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 2,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    dateText: {
        fontSize: 14,
        marginTop: 6,
    },
})

// a section holding small, horizontally sorted buttons meant to quickly take you to different parts of the app
export const quickActionStyle = StyleSheet.create({
    quickActionsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 28,
    },
    quickActionBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    quickActionLabel: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 6,
    },
    quickActionSublabel: {
        fontSize: 12,
        fontWeight: '600',
    }
})

// small popup indicators, like a number representing unread messages
export const badgeStyle = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "700",
    },
    countBadge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    countBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
})

// dropdown/select styles
export const dropdownStyle = StyleSheet.create({
    dropdownContainer: {
        alignContent: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        minWidth: '25%',
        width: '25%',
    },
    dropdownButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
})