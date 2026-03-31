import { containerStyle, dialogStyle, radioGroupStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { isAppTheme, LocalSettings } from "@/src/features/in-app-settings/api/storage_handler";
import { useStoredSettings } from "@/src/features/in-app-settings/logic/useStoredSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/rnreusables/ui/dialog';
import { Label } from "@/src/rnreusables/ui/label";
import { RadioGroup, RadioGroupItem } from '@/src/rnreusables/ui/radio-group';
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ParentGeneralInfoScreen() {
  // colors
  const bgcolor = useThemeColor({}, "background");
  const textcolor = useThemeColor({}, "text");
  const cardbgcolor = useThemeColor({}, "cardBackground");
  const tintcolor = useThemeColor({}, "tint");
  const modalbgcolor = useThemeColor({}, "modalBackground");
  const subtextcolor = useThemeColor({}, "placeholderText");

  // context given student data
  const {
      userParent,
  } = useParentLoginContext();

  // grabbing user settings from storage
  const {
    app_theme,
    updateStoredSettings,
    matchAppToStoredSettings,
  } = useStoredSettings(userParent.userId) // for now, hardwired to use debug parent. will change later

  const [inProgressSettings, setInProgressSettings] = useState<LocalSettings>({
    app_theme: app_theme
  })
  const [themeInProgress, setThemeInProgress] = useState<LocalSettings["app_theme"]>(app_theme)

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // stuff for radio group
  function onLabelPress(label: string) {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const templab = label.toLowerCase()
      if(isAppTheme(templab)) {
        setThemeInProgress(templab);
      }
      setIsDialogOpen(false);
    };
  }
  function onValueChange(value: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const templab = value.toLowerCase()
      if(isAppTheme(templab)) {
        setThemeInProgress(templab);
      }
      setIsDialogOpen(false);
    setIsDialogOpen(false);
  }

  // useeffect that's called when themeInProgress is changed
  // used to change inProgressSettings, the var that is stored to disk
  useEffect(() => {
    setInProgressSettings({
      app_theme: themeInProgress
    })
  }, [themeInProgress])

  const applySettings = async () => {
    await updateStoredSettings(inProgressSettings); // updating stored settings
    await matchAppToStoredSettings(); // applying stored settings
  }

  // temporary settings screen that only has dark/light mode toggle
  return (
    <View style={[containerStyle.container, {backgroundColor: bgcolor}]}>
      <ScrollView style={containerStyle.scrollContent}>
        <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>DISPLAY</Text>
        <Dialog 
          open={isDialogOpen}
          onOpenChange={() => {
            if(isDialogOpen) {
              setIsDialogOpen(false);
            } else {setIsDialogOpen(true)}
          }}
        >
          <DialogTrigger asChild> 
            <Pressable style={styles.optionContainer}>
              <MaterialIcons name="wb-sunny" size={28} color={tintcolor} />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionLabel, {color: textcolor}]}>Theme</Text>
                  <Text style={[styles.optionSublabel, {color: subtextcolor}]}>{inProgressSettings.app_theme}</Text>
                </View>
              </Pressable>
            </DialogTrigger>
          <DialogContent 
            style={[dialogStyle.dialogueContainer, {backgroundColor: modalbgcolor}]}
          >
            <DialogHeader>
              <DialogTitle style={{color: textcolor}}>Choose a Theme</DialogTitle>
            </DialogHeader>
            <RadioGroup style={radioGroupStyle.groupContainer} value={themeInProgress} onValueChange={onValueChange}>
              <View style={radioGroupStyle.itemContainer}>
                <RadioGroupItem style={radioGroupStyle.itemTick} value="light" id="r1" />
                <Label style={[radioGroupStyle.itemLabel, {color: textcolor}]} htmlFor="r1" onPress={onLabelPress('light')}>
                  Light
                </Label>
              </View>
              <View style={radioGroupStyle.itemContainer}>
                <RadioGroupItem style={radioGroupStyle.itemTick} value="dark" id="r2" />
                <Label style={[radioGroupStyle.itemLabel, {color: textcolor}]} htmlFor="r2" onPress={onLabelPress('dark')}>
                  Dark
                </Label>
              </View>
              <View style={radioGroupStyle.itemContainer}>
                <RadioGroupItem style={radioGroupStyle.itemTick} value="system" id="r1" />
                <Label style={[radioGroupStyle.itemLabel, {color: textcolor}]} htmlFor="r1" onPress={onLabelPress('system')}>
                  System default
                </Label>
              </View>
            </RadioGroup>
          </DialogContent>
        </Dialog>
      </ScrollView>
      <Card
        header="Apply"
        preview=""
        onPress={() => applySettings()}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextContainer: {
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4, 
  },
  optionSublabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});