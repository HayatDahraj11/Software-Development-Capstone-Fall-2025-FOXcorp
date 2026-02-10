import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";



export default function ParentHamburgerScreen() {
  const router = useRouter();
    
  const {
    isContextLoading,
    onSignOut,
  } = useParentLoginContext();

  const logoutHandler = async() => {
    await onSignOut();

    if(!isContextLoading) { router.replace('/login/school-selection') }
  }

  const RouteCard = (route: string): void => {
      // if card has a route, use it. if not, ignore it
      if(route === "account_settings") { 
        router.push({ 
          pathname: '/(parent)/(tabs)/(hamburger)/account_settings',
        });
      } else if(route === "notification_settings") {
        router.push({ 
          pathname: '/(parent)/(tabs)/(hamburger)/notification_settings',
        });
      } else if(route === "settings") {
        router.push({ 
          pathname: '/(parent)/(tabs)/(hamburger)/settings',
        });
      } else if(route === "logout") {
        console.log("Logout pushed, but no function to handle yet! Oops!")
      }
      else { }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: useThemeColor({},"background"),
    },
    cardContainer: {
      marginLeft: 12,
      marginRight: 12,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    card: {
      flex: 1
    },
    cardIconContainer: {
      flex: 1/14,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.cardContainer}>
          <MaterialIcons style={styles.cardIconContainer} name="settings" size={24} color={useThemeColor({},"tabIconDefault")}/>
          <View style={styles.card}>
            <Card
              header="Settings"
              preview=""
              onPress={() => RouteCard("settings")}
              theme="list"
              />
          </View>
        </View>
        <View style={styles.cardContainer}>
          <MaterialIcons style={styles.cardIconContainer} name="manage-accounts" size={24} color={useThemeColor({},"tabIconDefault")}/>
          <View style={styles.card}>
            <Card
            header="Account"
            preview=""
            onPress={() => RouteCard("account_settings")}
            theme="list"
            />
          </View>
        </View>
        <View style={styles.cardContainer}>
          <MaterialIcons style={styles.cardIconContainer} name="notifications" size={24} color={useThemeColor({},"tabIconDefault")}/>
          <View style={styles.card}>
            <Card
              header="Notifications"
              preview=""
              onPress={() => RouteCard("notification_settings")}
              theme="list"
              />
          </View>
        </View>
        <View style={styles.cardContainer}>
          <MaterialIcons style={styles.cardIconContainer} name="logout" size={24} color={useThemeColor({},"urgent")}/>
          <View style={styles.card}>
            <Card
              header="Logout"
              preview=""
              onPress={() => logoutHandler()}
              theme="list"
              />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}