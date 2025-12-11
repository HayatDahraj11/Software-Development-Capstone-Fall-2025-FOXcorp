import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View, Pressable, ScrollView} from "react-native";
import Card from "@/components/Card";

export default function announcements() {

const announcements = [
    {
      id: 1,
      date: "12/5/2025",
      header: "Announcement",
      preview: "Description",
    },
    {
      id: 2,
      date: "12/1/2025",
      header: "Announcement",
      preview: "Description",
    },
    {
      id: 3,
      date: "2/3/2024",
      header: "Announcement",
      preview: "Description",
    }
  ];


  const grouped = announcements.reduce((groups: any, item) => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
    return groups;
  }, {});
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {Object.keys(grouped).map((dateStr) => (
          <View key={dateStr} style={styles.section}>
            
            <View style={styles.dateRow}>
              <View style={styles.line} />
              <Text style={styles.dateText}>{dateStr}</Text>
              <View style={styles.line} />
            </View>

            {grouped[dateStr].map((item: any) => (
              <Card
                key={item.id}
                header={item.header}
                preview={item.preview}
                onPress={() => console.log("Open announcement")}
                theme="list"
              />
            ))}

          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 25,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "black",
  },
});