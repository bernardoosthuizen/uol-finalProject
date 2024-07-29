/* 
-------------------- SOCIAL TASKER - Tasks ---------------------
This is the tasks screen. It is the screen that displays all the user's tasks.
**/

import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import TaskListComponent from '../components/taskListComponent';
import { useAuth } from '../contextProviders/authContext';
import LoadingOverlay from '../components/loadingOverlay';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Tasks({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser, apiUrl } = useAuth();

  const isVisible = useIsFocused();

  useEffect(() => {
    AsyncStorage.getItem("tasks")
    .then((taskData) => {
      // If there is task data in local storage, use that
      if (taskData) {
        setTasks(JSON.parse(taskData));
      } else {
        setIsLoading(true);
        // Otherwise, fetch the tasks from the API
        fetch(`${apiUrl}/api/tasks/user/${currentUser.uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch tasks");
            }
            return response.json();
          })
          .then((data) => {
            setTasks(data);
            setIsLoading(false);
            AsyncStorage.setItem("tasks", JSON.stringify(data));
          })
          .catch((error) => {
            setError(error);
            setIsLoading(false);
          });
      }
    })
  }, [isVisible]); 


  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <View>
          <View style={styles.titleContainer}>
            <Text
              style={{
                fontSize: width * 0.06,
                color: "#4F83A5",
                fontWeight: "bold",
              }}>
              My Tasks
            </Text>
          </View>
          <View style={{ flex: 9, width: width * 0.9, marginVertical: "5%" }}>
            <TaskListComponent
              tasks={tasks}
              header={true}
              navigation={navigation}
            />
          </View>
        </View>
      )}
      <LoadingOverlay visible={isLoading} />
      <StatusBar style='dark-content' />
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
    width: '80%',
    flexDirection: "row", 
    alignItems: "center",
  },
});
