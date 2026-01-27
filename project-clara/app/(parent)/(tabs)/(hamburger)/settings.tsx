import { useState } from "react";
import { Appearance, ScrollView, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";

export default function ParentGeneralInfoScreen() {
  const [colorSchemeSelected, setColorSchemeSelected] = useState<string | null | undefined>(Appearance.getColorScheme())

  const toggleDarkMode = () => {
    if(Appearance.getColorScheme() === "light") {
      Appearance.setColorScheme("dark")
      setColorSchemeSelected("dark")
    } else { 
      Appearance.setColorScheme("light") 
      setColorSchemeSelected("light")
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: useThemeColor({}, "background"),
    },
    headerContainer: {
      flex: 1/10,
      alignContent: 'flex-start',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  });

  // temporary settings screen that only has dark/light mode toggle
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card
          header="Toggle Darkmode"
          preview={"Current mode is: "+colorSchemeSelected}
          onPress={() => toggleDarkMode()}
        />
      </ScrollView>
    </View>
  );
}