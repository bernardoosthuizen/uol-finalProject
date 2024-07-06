/* 
-------------------- SOCIAL TASKER - Leaderboard ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { Dimensions } from "react-native";
import { useEffect, useState } from "react";
import LeaderboardListComponent from '../components/leaderboardListComponent';
import { useAuth } from "../contextProviders/authContext";
import { Snackbar } from "react-native-paper";

export default function Leaderboard({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");

  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  const { currentUser } = useAuth();

  useEffect(() => {
    // fetch user data from backend
    fetch(`http://localhost:3000/friends/${currentUser.uid}`, {
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
        setFriends(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to get friends", error.message);
        navigation.navigate("LoggedInRoutes", { screen: "Home" });
        console.log(error);
      });
  }, []);
  
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontSize: width * 0.06,
            color: "#4F83A5",
            fontWeight: "bold",
          }}>
          Leaderboard
        </Text>
      </View>
      <View style={{ flex: 9, width: width * 0.9, marginVertical: "5%" }}>
        <LeaderboardListComponent users={friends} />
      </View>
      <Pressable
        style={{ flex: 1, justifyContent: "center" }}
        onPress={() => navigation.navigate("Find Friends")}>
        <Text
          style={{
            fontSize: width * 0.05,
            textDecorationLine: "underline",
            paddingVertical: "5%",
          }}>
          Find Friends
        </Text>
      </Pressable>
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
        }}></Snackbar>
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
});
