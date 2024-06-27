/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Pressable } from "react-native";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function EditTask({route, navigation}) {
    const taskdata = route.params?.taskdata;
    const [taskTitle, setTaskTitle] = useState(taskdata.title);
    const [taskPriority, setTaskPriority] = useState(taskdata.priority);
    const [taskDue, setTaskDue] = useState(taskdata.taskDue);
    const displayDate = (date) => {
      const d = new Date(date);
      return d.toDateString();
    };

    const newDate = displayDate(taskDue);
    const [taskID, setTaskID] = useState(taskdata.id);
    const [taskDescription, setTaskDescription] = useState(taskdata.description);
    const [taskDetails, setTaskDetails] = useState(taskdata.details);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const [priorityListOpen, setPriorityListOpen] = useState(false);
    const [priorities, setPriorities] = useState([
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
    ]);

    const handleDateConfirm = (date) => {
        alert("A date has been picked: ", date);
        setTaskDue(date.toISOString());
        setDatePickerVisibility(false);
    };

    const { width, height } = Dimensions.get("window");
    

    console.log(taskID, taskdata.id)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: width * 0.06,
              color: "#4F83A5",
              fontWeight: "bold",
            }}>
            Edit Task
          </Text>
        </View>
        <View style={{ flex: 9, width: width * 0.8, marginVertical: "5%" }}>
          <TextInput
            label='Title'
            mode='outlined'
            selectionColor='#4F83A5'
            activeOutlineColor='#4F83A5'
            placeholder='Task Title'
            value={taskTitle}
            onChangeText={(taskTitle) => setTaskTitle(taskTitle)}
          />
          <TextInput
            label='Description'
            mode='outlined'
            selectionColor='#4F83A5'
            activeOutlineColor='#4F83A5'
            placeholder='Description'
            value={taskDescription}
            onChangeText={(taskDescription) =>
              setTaskDescription(taskDescription)
            }
          />
          <TextInput
            label='Details'
            mode='outlined'
            selectionColor='#4F83A5'
            activeOutlineColor='#4F83A5'
            placeholder='Details'
            multiline={true}
            style={{ height: height / 4 }}
            value={taskDetails}
            onChangeText={(taskDetails) => setTaskDetails(taskDetails)}
          />
          <Pressable style={styles.datePicker} onPress={()=>(setDatePickerVisibility(true))}>
            <Text>{newDate}</Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode='date'
              onConfirm={handleDateConfirm}
              onCancel={()=>setDatePickerVisibility(false)}
            />
          </Pressable>
          <DropDownPicker
            open={priorityListOpen}
            value={taskPriority}
            items={priorities}
            setOpen={setPriorityListOpen}
            setValue={setTaskPriority}
            setItems={setPriorities}
            autoScroll={true}
            style={styles.priorityList}
            dropDownContainerStyle={styles.dropdownMenu}
          />
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1.0, width: width * 0.8 },
              styles.button,
            ]}
            onPress={() => {
              navigation.navigate("Tasks");
            }}>
            <Text style={{ color: "white" }}>Save</Text>
          </Pressable>
        </View>

        <StatusBar style='auto' />
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "8%",
    padding: "2%",
    marginVertical: "3%",
    paddingLeft: "3%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
  },
  priorityList: {
    borderColor: "grey",
  },
  dropdownMenu: {
    borderColor: "grey",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4F83A5",
    height: 45,
    padding: 15,
    marginVertical: '10%',
    borderRadius: 8,
  },
});
