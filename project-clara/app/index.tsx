import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

import { Colors } from "@/constants/theme";

export default function Index() {

  return (
    <View style={styles.container}>
      <Link href="/(parent)/(tabs)" asChild>
        <Pressable style={styles.pressable}>
          <Text style={styles.pressableLabel}>Parent View</Text>
        </Pressable>
      </Link>
      <Link href="/(teacher)" asChild>
      <Pressable style={styles.pressable}>
        <Text style={styles.pressableLabel}>Teacher View</Text>
      </Pressable>
      </Link>
      <Pressable style={styles.pressable}>
        <Text style={styles.pressableLabel}>Admin View</Text>
      </Pressable>
      <Link href="/_login" asChild>
        <Pressable style={styles.pressable}>
          <Text style={styles.pressableLabel}>Login Screen</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableLabel: {
    color: Colors.light.text,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  pressable: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
});