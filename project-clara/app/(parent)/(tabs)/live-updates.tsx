import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { DataCard, createStudentAttendanceCard, createStudentClassUpdateCard } from "@/src/features/cards/logic/cardDataCreator";
import Card from "@/src/features/cards/ui/Card";
import Parent_ChildPicker from "@/src/features/child-selection/ui/Parent_ChildPicker";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Teacher_parentSide } from "@/src/features/fetch-user-data/api/parent_data_fetcher";
import { useParentAnnouncements } from "@/src/features/announcements/logic/useParentAnnouncements";
import { fetchSchedulesByClass, DayOfWeek } from "@/src/features/schedules/api/scheduleRepo";
import { containerStyle } from "@/src/features/app-themes/constants/stylesheets";
import { MaterialIcons } from "@expo/vector-icons";

export default function ParentLiveUpdatesScreen() {
  // context givent parent and student data
  const {
      userParent,
      userStudents,
      userClasses,
      userEnrollments,
      userTeachers,
  } = useParentLoginContext();

  // get unique class ids from enrollments for fetching announcements
  const classIds = [...new Set(userEnrollments.map((e) => e.classId))];
  const { announcements, isLoading: announcementsLoading } = useParentAnnouncements(classIds);

  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  // figure out how long ago an announcement was posted
  const getTimeAgo = (dateStr: string): string => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // find the class name for an announcement
  const getClassName = (classId?: string | null): string => {
    if (!classId) return "";
    const cls = userClasses.find((c) => c.id === classId);
    return cls?.name ?? "";
  };

  const [screenCards, setScreenCards] = useState<DataCard[]>([]);

  // converts 24hr time from aws (like "14:30:00") to readable format (like "2:30 PM")
  const formatTime = (awsTime: string): string => {
    const [h, m] = awsTime.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
  };

  // get current day of week in the format AWS uses
  const getTodayDayOfWeek = (): DayOfWeek => {
    const days: DayOfWeek[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return days[new Date().getDay()];
  };

  const firstLoad = useCallback(async () => {
    let cardset: DataCard[] = []

    // go through each student and generate relevant cards for them
    for(const stu of userStudents) {
      const firstEnrollment = userEnrollments.find(enrollment => enrollment.studentId === stu.id)
      const firstClass = userClasses.find(theclass => theclass.id === firstEnrollment?.classId)
      let tempTeach: Teacher_parentSide
      if(firstClass) {
        const temptemp = userTeachers.find(teach => teach.id === firstClass.teacherId);
        tempTeach = temptemp ?? {id: "error", name: "error", schoolId: "error"};
      } else {
        tempTeach = {id: "error", name: "error", schoolId: "error"};
      }

      // fetch schedule for this class to get the end time
      let endTime: string | undefined;
      if(firstClass) {
        try {
          const schedResult = await fetchSchedulesByClass(firstClass.id);
          if(schedResult.data) {
            const todaySchedule = schedResult.data.find(s => s.dayOfWeek === getTodayDayOfWeek());
            if(todaySchedule) {
              endTime = formatTime(todaySchedule.endTime);
            }
          }
        } catch { /* schedule fetch is best-effort */ }
      }

      if(firstEnrollment && firstClass) {
        const classCard = createStudentClassUpdateCard(stu, firstClass, firstEnrollment, tempTeach, endTime)
        cardset.push(classCard);
      }

      const attendanceCard = createStudentAttendanceCard(stu);
      cardset.push(attendanceCard);
    }

    setScreenCards(cardset);
  }, [userClasses, userEnrollments, userStudents, userTeachers])

  useEffect(() => {
    firstLoad();
  }, [])

  
  const router = useRouter();

  const RouteCard = (route: string): void => {
        // if card has a route, use it. if not, ignore it
        if(route !== " ") { 
            router.push( (route) as Href );
        }
        else { }
  };

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState(userStudents[0]);

  // modal controller states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const onChildSelected = (id: string) => {
    let foundKid = userStudents.find(item => item.id === id);
    if(foundKid) {
      foundKid = {
        id: foundKid.id,
        firstName: foundKid.firstName,
        lastName: foundKid.lastName,
        gradeLevel: foundKid.gradeLevel,
        currentStatus: foundKid.currentStatus,
        attendanceRate: foundKid.attendanceRate
      }
      setChildSelected(foundKid);
    } else {
      if(id === "0") {
        const lilbro = {
          id: "0",
          firstName: "Everyone",
          lastName: "displayall",
          gradeLevel: 0,
          currentStatus: "displayall",
          attendanceRate: -1
        }
        setChildSelected(lilbro)
      }
      else {
        console.log("Somehow, a kid was selected that didn't exist. onChildSelected()")
      }
    }
  };

  // states for filtering the flatlist by kid
  // made with help from gemini
  const [filteredList, setFilteredList] = useState(screenCards);
  const [fullList, setFullList] = useState(screenCards)

  useEffect(() => {
    // if "Display All" is selected
    if(childSelected.id === '0') {
      setFilteredList(screenCards); // then display all the cards available
    }
    else {
      // when childSelected is changed, this will parse through the card list and select ones with matching studentIds
      for(let i = 0; i<screenCards.length; i++) {
        const newFilteredData = screenCards.filter(item => 
          item.itemId.match(childSelected.id)
        );
        setFilteredList(newFilteredData);
      }
    }
    
  }, [childSelected, fullList, screenCards])

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
    dropdownContainer: {
        flexDirection: 'row',
        width: '20%',
        height: '80%',
        backgroundColor: useThemeColor({}, "cardBackground"),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginHorizontal: 20,
        shadowColor: useThemeColor({}, "tabIconDefault"),
    },
    dropdownLabel: {
        color: useThemeColor({}, "text"),
        fontSize: 14,
        fontWeight: '600',
    },
    flatListContainer: {
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.dropdownContainer} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name={"keyboard-arrow-down"} size={22} color={useThemeColor({}, "icon")}/>
          <Text style={styles.dropdownLabel}>{childSelected.firstName}</Text>
        </Pressable>
      </View>
      {/* Announcements Section */}
      {announcements.length > 0 && (
        <View style={announcementStyles.section}>
          <Text style={[containerStyle.sectionLabel, { color: subtextColor, paddingHorizontal: 16 }]}>
            ANNOUNCEMENTS
          </Text>
          <ScrollView horizontal={false} style={{ maxHeight: 200, paddingHorizontal: 12 }}>
            {announcements.slice(0, 5).map((ann) => (
              <View key={ann.id} style={[announcementStyles.card, { backgroundColor: cardBg }]}>
                <View style={announcementStyles.cardRow}>
                  <View style={[announcementStyles.cardIcon, { backgroundColor: "#8b5cf620" }]}>
                    <Ionicons name="megaphone" size={18} color="#8b5cf6" />
                  </View>
                  <View style={announcementStyles.cardContent}>
                    <Text style={[announcementStyles.cardTitle, { color: textColor }]}>{ann.title}</Text>
                    <Text style={[announcementStyles.cardMeta, { color: subtextColor }]}>
                      {getClassName(ann.classId)} {getClassName(ann.classId) ? "· " : ""}{getTimeAgo(ann.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={[announcementStyles.cardBody, { color: subtextColor }]} numberOfLines={2}>
                  {ann.body}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      {announcementsLoading && (
        <View style={{ paddingVertical: 12, alignItems: "center" }}>
          <ActivityIndicator size="small" color={tint} />
        </View>
      )}

      {/* Student Updates */}
      <View style={styles.flatListContainer}>
        <FlatList
            data={filteredList}
            renderItem={({item}) => (
                <Card
                    header={item.header}
                    preview={item.preview}
                    onPress={() => RouteCard(item.route)}
                    urgent={item.urgent}
                />
            )}
        />
      </View>

      <Parent_ChildPicker 
        isVisible={isModalVisible}
        onCloseModal={() => setIsModalVisible(false)}
        studentNames={userStudents.map((item) => item.firstName)}
        studentIds={userStudents.map((item) => item.id)}
        onSelect={onChildSelected}
        allowAll={true}
      />
    </View>
  );
}

const announcementStyles = StyleSheet.create({
  section: { marginBottom: 8 },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardMeta: { fontSize: 12, marginTop: 1 },
  cardBody: { fontSize: 13, lineHeight: 19, marginLeft: 48 },
});

