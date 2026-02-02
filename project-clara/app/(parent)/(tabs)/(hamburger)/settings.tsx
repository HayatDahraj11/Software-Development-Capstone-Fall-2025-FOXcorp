import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { debug_parent } from "@/src/features/auth/logic/debug_parent_data";
import Card from "@/src/features/cards/ui/Card";
import { LocalSettings } from "@/src/features/in-app-settings/api/storage_handler";
import { useStoredSettings } from "@/src/features/in-app-settings/logic/useStoredSettings";

export default function ParentGeneralInfoScreen() {
  // grabbing user settings from storage
  const {
    app_theme,
    isLoading,
    updateStoredSettings,
    matchAppToStoredSettings,
  } = useStoredSettings(debug_parent.guardianUser.userId) // for now, hardwired to use debug parent. will change later

  const [inProgressSettings, setInProgressSettings] = useState<LocalSettings>({
    app_theme: app_theme
  })

  const toggleDarkMode = () => {
    if(inProgressSettings.app_theme === "light") {
      setInProgressSettings({
        app_theme: "dark"
      })
    } else { 
      setInProgressSettings({
        app_theme: "light"
      })
    }
  }

  const applySettings = async () => {
    await updateStoredSettings(inProgressSettings); // updating stored settings
    await matchAppToStoredSettings(); // applying stored settings
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: useThemeColor({}, "background"),
    },
  });

  // temporary settings screen that only has dark/light mode toggle
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card
          header="Toggle Darkmode"
          preview={"Current mode is: "+inProgressSettings.app_theme}
          onPress={() => toggleDarkMode()}
        />
      </ScrollView>
      <Card
        header="Apply"
        preview=""
        onPress={() => applySettings()}
      />
    </View>
  );
}