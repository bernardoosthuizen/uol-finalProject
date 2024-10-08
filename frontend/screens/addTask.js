/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/
// Import modules
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
import { useState, useEffect } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from '../contextProviders/authContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Snackbar } from "react-native-paper";
// Import custom components and helpers
import LoadingOverlay from "../components/loadingOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTask({navigation}) {
  // Screen state and constants
  const { currentUser, apiUrl } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Task input states
  const displayDate = (date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  const [taskTitle, setTaskTitle] = useState(null);
  const [taskPriority, setTaskPriority] = useState(null);
  const [taskDue, setTaskDue] = useState(new Date());
  const newDate = displayDate(taskDue);
  const [taskID, setTaskID] = useState(null);
  const [taskDescription, setTaskDescription] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [priorityListOpen, setPriorityListOpen] = useState(false); // List select
  const [priorities, setPriorities] = useState([
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ]); // Define available priorities

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  const handleDateConfirm = (date) => {
    setTaskDue(date.toISOString());
    setDatePickerVisibility(false);
  };

  // Validate form
  const validateTaskData = () => {
    let errors = {};

    // Validate title field
    if (!taskTitle) {
      errors.name = "Title is required.";
    }
    // Validate description field
    if (!taskDescription) {
      errors.description = "Description is required.";
    }
    // Validate details field
    if (!taskDetails) {
      errors.details = "Details are required.";
    }
    // Validate priority field
    if (!taskPriority) {
      errors.priority = "Priority is required.";
    }
    // Validate due date field
    if (!taskDue) {
      errors.due_date = "Due date is required.";
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  useEffect(() => {
    // Trigger form validation when task data changes
    validateTaskData();
  }, [taskTitle, taskDescription, taskDetails, taskPriority, taskDue]);

  const handleTaskSave = () => {
    setLoading(true);
    // Check form validation errors
    if (!isFormValid) {
      if (Object.keys(errors).length == 1) {
        const key = Object.keys(errors)[0];
        const errorText = errors[key];
        setLoading(false);
        setSnackBarVisible(true);
        setSnackbarMessage(errorText);
        return;
      } else {
        setLoading(false);
        setSnackBarVisible(true);
        setSnackbarMessage("Please fill out all required fields");
        return;
      }
    }

    const newTaskData = {
      title: taskTitle,
      priority: taskPriority,
      due_date: Date.parse(taskDue),
      description: taskDescription,
      details: taskDetails,
      status: "open",
      user_id: currentUser.uid,
    };

    // Save to databse
    fetch(`${apiUrl}/api/new-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
      body: JSON.stringify(newTaskData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check for errors
        if (data.errors) {
          // throw error
          throw new Error(data.errors);
        }
        // Save task to local storage
        AsyncStorage.getItem("tasks")
          .then((taskData) => {
            newTaskData.id = data.docId;
            let taskArray = JSON.parse(taskData);
            taskArray.push(newTaskData);
            AsyncStorage.setItem("tasks", JSON.stringify(taskArray));
          })
          .then(() => {
            // Navigate to task page
            navigation.navigate("Task", { taskId: data.docId, goBack: false });
          });
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
            placeholder='Select Priority'
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
        <LoadingOverlay visible={isLoading} />
        <StatusBar style='dark-content' />
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
