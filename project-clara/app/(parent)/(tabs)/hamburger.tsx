import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { containerStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Button } from "@/src/rnreusables/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/src/rnreusables/ui/dialog';
import { useState } from "react";



export default function ParentHamburgerScreen() {
  const router = useRouter();

  const bgcolor = useThemeColor({}, "background");
  const defaulticoncolor = useThemeColor({}, "tabIconDefault");
  const urgentcolor = useThemeColor({}, "urgent");
  const modalbgcolor = useThemeColor({}, "modalBackground");
  const textcolor = useThemeColor({}, "text");
  const fullbrightcolor = useThemeColor({}, "fullBright");
  const tintColor = useThemeColor({}, "tint");
    
  const {
    isContextLoading,
    onSignOut,
  } = useParentLoginContext();

  const logoutHandler = async() => {
    await onSignOut();

    if(!isContextLoading) { router.replace('/login/school-selection') }
  }

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // stuff for confirming whether user wants to log out
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const logoutSelected = (selectedOption: boolean) => {
    if(selectedOption) {
      setLogoutLoading(true);
      logoutHandler();
    } else {
      setIsDialogOpen(false);
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
      } 
      else { console.warn("parent hamburger screen: Tried to route to invalid route.") }
  };

  return (
    <View style={[containerStyle.container, {backgroundColor: bgcolor}]}>
      <ScrollView contentContainerStyle={containerStyle.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={false}>
        <Card
          header="Settings"
          preview=""
          onPress={() => RouteCard("settings")}
          theme="list"
          icon={{name: "settings", size: 24, color: defaulticoncolor, backgroundColor: "#fff"}}
          />
        <Card
          header="Account"
          preview=""
          onPress={() => RouteCard("account_settings")}
          theme="list"
          icon={{name: "person-circle-outline", size: 24, color: defaulticoncolor, backgroundColor: "#fff"}}
          />
        <Card
          header="Notifications"
          preview=""
          onPress={() => RouteCard("notification_settings")}
          theme="list"
          icon={{name: "notifications", size: 24, color: defaulticoncolor, backgroundColor: "#fff"}}
          />
        <Card
          header="Logout"
          preview=""
          onPress={() => {setIsDialogOpen(true)}}
          theme="list"
          icon={{name: "log-in-outline", size: 24, color: urgentcolor, backgroundColor: "#fff"}}
          />
          <Dialog
            open={isDialogOpen}
            onOpenChange={() => {
              if(isDialogOpen) {
                setIsDialogOpen(false);
              } else {setIsDialogOpen(true);}
            }}
          >
            <DialogContent
              style={[styles.dialogueContainer, {backgroundColor: modalbgcolor}]}
            >
            {!logoutLoading ? (
              <View>
                <DialogHeader>
                  <DialogTitle style={{color: textcolor}}>Log Out</DialogTitle>
                </DialogHeader>
                <Text style={[{color: textcolor, fontSize: 20, fontWeight: 400}]}>Are you sure you want to logout?</Text>
                <View style={{justifyContent: "space-evenly", alignItems: "center", flexDirection: "row"}}>
                  <Button variant={"default"} style={[styles.pressable, {backgroundColor: tintColor}, {shadowColor: tintColor}]} onPress={() => logoutSelected(false)}>
                    <Text style={[styles.pressableLabel, {color: fullbrightcolor}]}>Cancel</Text>
                  </Button>
                  <Button variant={"destructive"} style={[styles.pressable, {backgroundColor: urgentcolor}, {shadowColor: urgentcolor}]} onPress={() => logoutSelected(true)}>
                    <Text style={[styles.pressableLabel, {color: fullbrightcolor}]}>Log Out</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <View>
                <DialogHeader>
                  <DialogTitle style={{color: textcolor}}>Logging Out...</DialogTitle>
                </DialogHeader>
                <View style={{ paddingVertical: 12, alignItems: "center" }}>
                  <ActivityIndicator size="large" color={tintColor} />
                </View>
              </View>
            )}
            </DialogContent>
          </Dialog>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    pressable: {
        flexDirection: 'row',
        width: '40%',
        height: 56,
        marginTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pressableLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    dialogueContainer: {
        minHeight: '10%',
        minWidth: '80%',
        width: '80%',
    },
})