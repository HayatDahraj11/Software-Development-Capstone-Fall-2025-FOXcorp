import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import Card from "@/components/Card";
import Parent_ChildPicker from "@/components/Parent_ChildPicker";
import { Colors } from "@/src/features/app-themes/logic/theme";
import { debug_kids, debug_parent } from "@/src/features/auth/logic/debug_parent_data";
import { MaterialIcons } from "@expo/vector-icons";

// list used for making cards with the flat view. this will be done dynamically later
const CardFlatListData = [
    {
      id: 1,
      child: debug_kids.firstChildInfoDictionary,
      header: `${debug_kids.firstChildInfoDictionary.firstName} is in ${debug_kids.firstChildInfoDictionary.classes[0]} with [teacherName] until [classEndTime]!`,
      preview: `They have a test this friday!`,
      route: ' ',
      urgent: true,
    },
    {
      id: 2,
      child: debug_kids.secondChildInfoDictionary,
      header: `${debug_kids.secondChildInfoDictionary.firstName} is in ${debug_kids.secondChildInfoDictionary.classes[0]} with [teacherName] until [classEndTime]!`,
      preview: 'They have a 100%',
      route: ' ',
      urgent: true,
    },
    {
      id: 3,
      child: debug_kids.firstChildInfoDictionary,
      header: `${debug_kids.firstChildInfoDictionary.firstName} has had perfect attendance today. 0 tardies!`,
      preview: ``,
      route: ' ',
    },
    {
      id: 4,
      child: debug_kids.secondChildInfoDictionary,
      header: `[teacherName] sent out an Announcement from ${debug_kids.secondChildInfoDictionary.classes[0]}!`,
      preview: `Dear parents, your child has a book report due next Tuesday.`,
      route: ' ',
      urgent: true
    },
    {
      id: 5,
      child: debug_kids.secondChildInfoDictionary,
      header: `${debug_kids.secondChildInfoDictionary.firstName} has a test in ${debug_kids.secondChildInfoDictionary.classes[0]} on Friday, 11/21!`,
      preview: ``,
      route: ' ',
      urgent: true
    }
];

export default function ParentLiveUpdatesScreen() {


  const router = useRouter();

  const RouteCard = (route: string): void => {
        // if card has a route, use it. if not, ignore it
        if(route !== " ") { 
            router.push( (route) as Href );
        }
        else { }
  };

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState(debug_parent.guardianUser.children[0]);

  // modal controller states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const onChildSelected = (id: string) => {
    let foundKid = debug_parent.guardianUser.children.find(item => item.studentId === id);
    if(foundKid) {
      foundKid = {
        studentId: foundKid?.studentId,
        firstName: foundKid?.firstName,
        lastName: foundKid?.lastName,
        dob: foundKid?.dob,
        classes: foundKid?.classes,
        attendanceRate: foundKid?.attendanceRate
      }
      setChildSelected(foundKid);
    } else {
      if(id === "0") {
        const lilbro = {
          studentId: "0",
          firstName: "Everyone",
          lastName: "displayall",
          dob: "displayall",
          classes: ["displayall"],
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
  const [filteredList, setFilteredList] = useState(CardFlatListData);
  const [fullList, setFullList] = useState(CardFlatListData)

  useEffect(() => {
    // if "Display All" is selected
    if(childSelected.studentId === '0') {
      setFilteredList(CardFlatListData); // then display all the cards available
    }
    else {
      // when childSelected is changed, this will parse through the card list and select ones with matching studentIds
      for(let i = 0; i<CardFlatListData.length; i++) {
        const newFilteredData = CardFlatListData.filter(item => 
          item.child.studentId.match(childSelected.studentId)
        );
        setFilteredList(newFilteredData);
      }
    }
    
  }, [childSelected, fullList])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.dropdownContainer} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name={"keyboard-arrow-down"} size={22} color={Colors.light.icon}/>
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
        studentNames={debug_parent.guardianUser.children.map((item) => item.firstName)}
        studentIds={debug_parent.guardianUser.children.map((item) => item.studentId)}
        onSelect={onChildSelected}
        allowAll={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
      backgroundColor: '#d4d4d4ff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginHorizontal: 20,
      shadowColor: Colors.light.tabIconDefault,
  },
  dropdownLabel: {
      color: Colors.light.text,
      fontSize: 14,
      fontWeight: '600',
  },
  flatListContainer: {
  }
});