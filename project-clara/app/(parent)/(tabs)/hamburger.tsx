import { MaterialIcons } from "@expo/vector-icons";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import Card from "@/components/Card";
import { useParentLoginContext } from "@/context/ParentLoginContext";

async function AWSSignOut() {
  try {
    await signOut();
    console.log("AWS Signout sent and received");
    return true
  } catch(error) {
    console.log("AWS Signout sent and failed: ",{error})
    return false
  }
}

export default function ParentHamburgerScreen() {
  const { isDebug } = useParentLoginContext();
  const router = useRouter();
  const logoutHandler = (): void => {
    // if this is a debug session, i.e., not using AWS
    if(isDebug) {
      Alert.alert("Debug Logout","Debug Logout Successful!")
      router.replace("/login/school-selection")
    }
    // if the user is logged in via aws
    else {
      Alert.alert("AWS Logout","AWS Logout attempted, trying to log out.")
      AWSSignOut().then((success) => {
        if(success) {
          Alert.alert("AWS Logout","AWS Logout successful! Rerouting...")
          router.replace("/login/school-selection")
        } else {
          console.log("AWS Signout failed. Sorry!")
        }
      })
    }
  };  

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.cardContainer}>
          <MaterialIcons style={styles.cardIconContainer} name="settings" size={24} color="black"/>
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
          <MaterialIcons style={styles.cardIconContainer} name="manage-accounts" size={24} color="black"/>
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
          <MaterialIcons style={styles.cardIconContainer} name="notifications" size={24} color="black"/>
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
          <MaterialIcons style={styles.cardIconContainer} name="logout" size={24} color="red"/>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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