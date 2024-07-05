/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Pressable, Alert, Image } from "react-native";
import { useAuth } from '../contextProviders/authContext';
import LoadingOverlay from "../components/loadingOverlay";
import { Snackbar } from "react-native-paper";

export default function Task({route, navigation}) {
  const [taskdata, setTaskData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useAuth();
  const { taskId } = route.params;

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");

  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  // Get the task data from the server
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/task/${currentUser.uid}/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTaskData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to get task", error.message);
        navigation.navigate("ProtectedrRoutes");
        console.log(error);
      });
  }, []);

  const date = new Date();

  const displayDate = (date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  const newDate = displayDate(date);

  const { width, height } = Dimensions.get("window");
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
                marginBottom: "5%",
              }}>
              {taskdata.title}
            </Text>
            <Text
              style={{
                fontSize: width * 0.04,
              }}>
              {taskdata.description}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Image
              source={require("../assets/icons/calendar.png")}
              style={{ width: 20, height: 20, marginRight: "5%" }}
            />
            <Text>{newDate}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text>{taskdata.details}</Text>
          </View>
          <View style={styles.actionsContainer}>
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
                styles.button,
              ]}
              onPress={() => {
                alert("press");
              }}>
              <Text style={{ color: "white" }}>Complete</Text>
            </Pressable>
            <Pressable
              style={{ flex: 1, alignItems: "center", marginTop: "5%" }}
              onPress={() => {
                navigation.navigate("Edit Task", { taskdata: taskdata });
              }}>
              <Text style={{ color: "black", textDecorationLine: "underline" }}>
                Edit Task
              </Text>
            </Pressable>
            <Pressable
              style={{ flex: 1, alignItems: "center" }}
              onPress={() => {
                Alert.alert(
                  "Delete Task",
                  `Do you want to delete ${taskdata.title}?`,
                  [
                    {
                      text: "NO",
                      style: "cancel",
                    },
                    { text: "YES", onPress: () => console.log("OK Pressed") },
                  ]
                );
              }}>
              <Text style={{ color: "black", textDecorationLine: "underline" }}>
                Delete Task
              </Text>
            </Pressable>
          </View>
        </View>
      )}
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
    flex: 2,
    width: "80%",
    justifyContent: "center",
  },
  dateContainer: {
    flex: 1,
    width: "80%",
    flexDirection: "row",
    alignContent: "center",

  },
  detailsContainer: {
    flex: 4,
    width: "80%",
  },
  actionsContainer: {
    flex: 2,
    width: "80%",
    alignContent: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4F83A5",
    height: 45,
    padding: 15,
    margin: 12,
    borderRadius: 8,
  },
});
