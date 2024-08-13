/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Pressable, Alert, Image } from "react-native";
import { useAuth } from '../contextProviders/authContext';
import LoadingOverlay from "../components/loadingOverlay";
import { Snackbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Task({route, navigation}) {
  const [taskdata, setTaskData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser, apiUrl } = useAuth();
  const { taskId, goBack } = route.params;

  const isVisible = useIsFocused();


  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");

  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => 
        ( !goBack ? (
          <HeaderBackButton
            onPress={() => {
              navigation.navigate("LoggedInRoutes", {screen: "Tasks"});
            }}
          />
        ) : (
          <HeaderBackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          
        ) // Default back button behavior
                                    ),
        
    });
  }, [navigation, goBack]);

  // Get the task data from the server
  useEffect(() => {
    setIsLoading(true);
    AsyncStorage.getItem("tasks").then((taskData) => {
      if(taskData) {
        let taskArray = JSON.parse(taskData);
        let localTask = taskArray.find((task) => task.id === taskId);
        setTaskData(localTask);
        setIsLoading(false);
      } else {
        fetch(`${apiUrl}/api/task/${taskId}/user/${currentUser.uid}`, {
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
            // Save task to local storage
            AsyncStorage.getItem("tasks")
              .then((taskData) => {
                let taskArray = JSON.parse(taskData);
                taskArray.push(data);
                AsyncStorage.setItem("tasks", JSON.stringify(taskArray));
              })
              .catch((error) => {
                console.error("Failed to save task to local storage", error);
              });
          })
          .catch((error) => {
            setSnackBarVisible(true);
            setSnackbarMessage("Failed to get task", error.message);
            navigation.navigate("ProtectedrRoutes");
            console.log(error);
          });
      }
    });
    
  }, [isVisible]);

  const date = new Date();

  const displayDate = (date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  const confettiRef = useRef(null);

  handleTaskComplete = () => {
    setIsLoading(true);
    fetch(`${apiUrl}/api/user/${currentUser.uid}/complete-task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          AsyncStorage.getItem("tasks")
            .then((taskData) => {
              let taskArray = JSON.parse(taskData);
              let index = taskArray.findIndex((task) => task.id === taskId);
              // remove the task from the array
              taskArray.splice(index, 1);
              AsyncStorage.setItem("tasks", JSON.stringify(taskArray));
            })
            .then(() => {
              setIsLoading(false);
              confettiRef.current?.play(0);
              setSnackBarVisible(true);
              setSnackbarMessage("Task completed successfully");

              setTimeout(() => {
              // Navigate back
                navigation.navigate("LoggedInRoutes", { screen: "Tasks" });
              }, 1000);
            });
        }
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to complete task", error.message);
        navigation.navigate("ProtectedRoutes");
        console.log(error);
      });
  }

  const handleDeleteTask = () => {
    setIsLoading(true);
    fetch(`${apiUrl}/api/user/${currentUser.uid}/task/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          AsyncStorage.getItem("tasks").then((taskData) => {
            let taskArray = JSON.parse(taskData);
            let index = taskArray.findIndex((task) => task.id === taskId);
            // remove the task from the array
            taskArray.splice(index, 1);
            AsyncStorage.setItem("tasks", JSON.stringify(taskArray));
          })
          .then(() => {
            setIsLoading(false);
            setSnackBarVisible(true);
            setSnackbarMessage("Task deleted successfully");
            // Navigate back
            navigation.navigate("LoggedInRoutes", { screen: "Tasks" });
          });
        }
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to delete task", error.message);
        navigation.navigate("ProtectedRoutes");
        console.log(error);
      });
  }

  const { width, height } = Dimensions.get("window");
  return (
    <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.titleContainer}>
            <Text
              style={{
                fontSize: width * 0.06,
                color: "#4F83A5",
                fontWeight: "bold",
                marginBottom: "5%",
              }}>
              {taskdata?.title}
            </Text>
            <Text
              style={{
                fontSize: width * 0.04,
              }}>
              {taskdata?.description}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons
              name='calendar-month-outline'
              size={26}
              color={"grey"}
            />
            <Text style={{ margin: "5%" }}>
              {displayDate(taskdata?.due_date)}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text>{taskdata?.details}</Text>
          </View>
          <View style={styles.actionsContainer}>
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
                styles.button,
              ]}
              onPress={() => {
                handleTaskComplete();
              }}>
              <Text style={{ color: "white" }}>Complete</Text>
            </Pressable>
            <Pressable
              style={{ flex: 1, alignItems: "center", marginTop: "5%" }}
              onPress={() => {
                navigation.navigate("Edit Task", {
                  taskdata: taskdata,
                  taskId: taskId,
                });
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
                    {
                      text: "YES",
                      onPress: () => {
                        handleDeleteTask();
                      },
                    },
                  ]
                );
              }}>
              <Text style={{ color: "black", textDecorationLine: "underline" }}>
                Delete Task
              </Text>
            </Pressable>
          </View>
        </View>
      {/* Lottie animation */}
      <LottieView
        ref={confettiRef}
        source={require("../assets/celebration-animation.json")}
        autoPlay={false}
        loop={false}
        style={styles.lottie}
        resizeMode='cover'
      />

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
    flex: 1.5,
    width: "80%",
    justifyContent: "center",
  },
  dateContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 3,
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
    justifyContent: "center",
    backgroundColor: "#4F83A5",
    height: 50,
    padding: 15,
    margin: 12,
    borderRadius: 8,
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: "none",
  },
});
