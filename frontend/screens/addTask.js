/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from '../contextProviders/authContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Snackbar } from "react-native-paper";

export default function AddTask({navigation}) {
  const { currentUser } = useAuth();
  const [taskTitle, setTaskTitle] = useState(null);
  const [taskPriority, setTaskPriority] = useState(null);
  const [taskDue, setTaskDue] = useState(new Date());
  const displayDate = (date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  const newDate = displayDate(taskDue);
  const [taskID, setTaskID] = useState(null);
  const [taskDescription, setTaskDescription] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [priorityListOpen, setPriorityListOpen] = useState(false);
  const [priorities, setPriorities] = useState([
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ]);

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");

  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  const handleDateConfirm = (date) => {
    alert("A date has been picked: ", date);
    setTaskDue(date.toISOString());
    setDatePickerVisibility(false);
  };

  const handleTaskSave = () => {
    fetch("http://localhost:3000/new-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
      body: JSON.stringify({
        title: taskTitle,
        priority: taskPriority,
        due_date: taskDue,
        description: taskDescription,
        details: taskDetails,
        status: "open",
        user_id: currentUser.uid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check for errors
        if (data.errors) {
          // throw error
          throw new Error(data.errors);
        } 
        // Navigate to task page
        navigation.navigate("Task", { taskId: data.docId, goBack: false });
      })
      .catch((error) => {
        console.error("Error:", error); 
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to create task", error);
      });
  };

  const { width, height } = Dimensions.get("window");
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: width * 0.06,
              color: "#4F83A5",
              fontWeight: "bold",
            }}>
            Add Task
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
          <Pressable
            style={styles.datePicker}
            onPress={() => setDatePickerVisibility(true)}>
            <Text>{newDate}</Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode='date'
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisibility(false)}
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
              handleTaskSave();
            }}>
            <Text style={{ color: "white" }}>Save</Text>
          </Pressable>
        </View>
        {/* Snackbars - display errors to user */}
        <Snackbar
          visible={snackBarVisible}
          onDismiss={onDismissSnackBar}
          rippleColor={"#4F83A5"}
          action={{
            label: "Dismiss",
            textColor: "#4F83A5",
            onPress: () => {
              // Do something
            },
          }}>
          <Text style={{ color: "white" }}>{snackbarMessage}</Text>
        </Snackbar>
        <StatusBar style='auto' />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
