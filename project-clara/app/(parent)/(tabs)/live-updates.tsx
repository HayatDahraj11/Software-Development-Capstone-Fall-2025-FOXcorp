import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { DataCard, createStudentAttendanceCard, createStudentClassUpdateCard } from "@/src/features/cards/logic/cardDataCreator";
import Card from "@/src/features/cards/ui/Card";
import Parent_ChildPicker from "@/src/features/child-selection/ui/Parent_ChildPicker";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Teacher_parentSide } from "@/src/features/fetch-user-data/api/parent_data_fetcher";
import { MaterialIcons } from "@expo/vector-icons";

export default function ParentLiveUpdatesScreen() {
  // context givent parent and student data
  const {
      userParent,
      userStudents,
      userClasses,
      userEnrollments,
      getTeacherInfo,
  } = useParentLoginContext();

  const [screenCards, setScreenCards] = useState<DataCard[]>([]);

  const firstLoad = useCallback(async () => {
    let cardset: DataCard[] = []

    // go through each student and generate relevant cards for them
    for(const stu of userStudents) {
      const firstEnrollment = userEnrollments.find(enrollment => enrollment.studentId === stu.id) // finding the first enrollment this student is enrolled in
      const firstClass = userClasses.find(theclass => theclass.id === firstEnrollment?.classId)
      // this will call aws if there is a firstClass
      const tempTeach: Teacher_parentSide = firstClass ? await getTeacherInfo(firstClass.teacherId) : { id: "hello!", name: "Mr. Hello!", schoolId: "Hello!!" }

      if(firstEnrollment && firstClass) {
        // calling external function to handle creating data that goes into the card
        const classCard = createStudentClassUpdateCard(stu, firstClass, firstEnrollment, tempTeach)
        cardset.push(classCard);
      }

      const attendanceCard = createStudentAttendanceCard(stu);
      cardset.push(attendanceCard);
    }
    
    setScreenCards(cardset);
  }, [userClasses, userEnrollments, userStudents, getTeacherInfo])

  useEffect(() => {
    firstLoad();
  }, [])

  /*
  // list used for making cards with the flat view. this will be done dynamically later
  const CardFlatListData = useMemo(() => {
    return [
      {
        id: 1,
        child: userStudents[0],
        header: `${userStudents[0].firstName} is in ${"--placeholder name--"} with [teacherName] until [classEndTime]!`,
        preview: `They have a test this friday!`,
        route: ' ',
        urgent: true,
      },
      {
        id: 2,
        child: userStudents[0],
        header: `${userStudents[0].firstName} is in ${"--placeholder name--"} with [teacherName] until [classEndTime]!`,
        preview: 'They have a 100%',
        route: ' ',
        urgent: true,
      },
      {
        id: 3,
        child: userStudents[0],
        header: `${userStudents[0].firstName} has had perfect attendance today. 0 tardies!`,
        preview: ``,
        route: ' ',
      },
      {
        id: 4,
        child: userStudents[0],
        header: `[teacherName] sent out an Announcement from ${"--placeholder name--"}!`,
        preview: `Dear parents, your child has a book report due next Tuesday.`,
        route: ' ',
        urgent: true
      },
      {
        id: 5,
        child: userStudents[0],
        header: `${userStudents[0].firstName} has a test in ${"--placeholder name--"} on Friday, 11/21!`,
        preview: ``,
        route: ' ',
        urgent: true
      }
    ]
  }, [userStudents]) 
  */


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
      {/* visual bug: dropdown container size inconsistent with general-info appearance */}
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

