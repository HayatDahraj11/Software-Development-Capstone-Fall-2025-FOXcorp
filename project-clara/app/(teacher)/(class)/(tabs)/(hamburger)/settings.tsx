import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Card from "@/src/features/cards/ui/Card";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useStoredSettings } from "@/src/features/in-app-settings/logic/useStoredSettings";
import { isAppTheme, LocalSettings } from "@/src/features/in-app-settings/api/storage_handler";
import { debug_teacher } from "@/src/features/auth/logic/debug_teacher_data";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/src/rnreusables/ui/dialog";
import { Label } from "@/src/rnreusables/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/rnreusables/ui/radio-group";
import { containerStyle, dialogStyle, radioGroupStyle } from "@/src/features/app-themes/constants/stylesheets";

export default function TeacherGeneralInfoScreen() {
  // colors
  const bgcolor = useThemeColor({}, "background");
  const textcolor = useThemeColor({}, "text");
  const cardbgcolor = useThemeColor({}, "cardBackground");
  const tintcolor = useThemeColor({}, "tint");
  const modalbgcolor = useThemeColor({}, "modalBackground");
  const subtextcolor = useThemeColor({}, "placeholderText");

  // grabbing user settings from storage
  const {
    app_theme,
    updateStoredSettings,
    matchAppToStoredSettings,
  } = useStoredSettings(debug_teacher.userId); // debug teacher

  const [inProgressSettings, setInProgressSettings] = useState<LocalSettings>({
    app_theme: app_theme,
  });
  const [themeInProgress, setThemeInProgress] = useState<LocalSettings["app_theme"]>(app_theme);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // update inProgressSettings when themeInProgress changes
  useEffect(() => {
    setInProgressSettings({
      app_theme: themeInProgress,
    });
  }, [themeInProgress]);

  const onLabelPress = (label: string) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const templab = label.toLowerCase();
    if (isAppTheme(templab)) {
      setThemeInProgress(templab);
    }
    setIsDialogOpen(false);
  };

  const onValueChange = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const templab = value.toLowerCase();
    if (isAppTheme(templab)) {
      setThemeInProgress(templab);
    }
    setIsDialogOpen(false);
  };

  const applySettings = async () => {
    await updateStoredSettings(inProgressSettings);
    await matchAppToStoredSettings();
  };

  return (
    <View style={[containerStyle.container, { backgroundColor: bgcolor }]}>
      <ScrollView style={containerStyle.scrollContent}>
        <Text style={[containerStyle.sectionLabel, { color: subtextcolor }]}>DISPLAY</Text>
        <Dialog
          open={isDialogOpen}
          onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
        >
          <DialogTrigger asChild>
            <Pressable style={styles.optionContainer}>
              <MaterialIcons name="wb-sunny" size={28} color={tintcolor} />
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionLabel, { color: textcolor }]}>Theme</Text>
                <Text style={[styles.optionSublabel, { color: subtextcolor }]}>{inProgressSettings.app_theme}</Text>
              </View>
            </Pressable>
          </DialogTrigger>
          <DialogContent style={[dialogStyle.dialogueContainer, { backgroundColor: modalbgcolor }]}>
            <DialogHeader>
              <DialogTitle style={{ color: textcolor }}>Choose a Theme</DialogTitle>
            </DialogHeader>
            <RadioGroup style={radioGroupStyle.groupContainer} value={themeInProgress} onValueChange={onValueChange}>
              {["light", "dark", "system"].map((theme, idx) => (
                <View style={radioGroupStyle.itemContainer} key={idx}>
                  <RadioGroupItem style={radioGroupStyle.itemTick} value={theme} id={`r${idx}`} />
                  <Label
                    style={[radioGroupStyle.itemLabel, { color: textcolor }]}
                    htmlFor={`r${idx}`}
                    onPress={onLabelPress(theme)}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Label>
                </View>
              ))}
            </RadioGroup>
          </DialogContent>
        </Dialog>
      </ScrollView>
      <Card
        header="Apply"
        preview=""
        onPress={applySettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  optionTextContainer: {
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  optionSublabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});