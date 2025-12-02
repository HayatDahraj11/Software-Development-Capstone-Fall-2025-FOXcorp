import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useRouter, Href } from "expo-router";

import Card from "@/components/Card";
import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

export default function ParentHamburgerScreen() {
  const router = useRouter();

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
              onPress={() => RouteCard("logout")}
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