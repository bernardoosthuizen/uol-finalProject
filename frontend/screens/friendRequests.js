/* 
-------------------- SOCIAL TASKER - Friend Request ---------------------
This is the friend request screen. It is the screen that displays all the 
friend requests received by the user
**/

import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable
} from "react-native";
import { Dimensions, Alert } from "react-native";


export default function FriendRequest() {
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
          Friend Requests
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={{ fontSize: width * 0.05 }}>Score</Text>
        <Text style={{ fontSize: width * 0.3, fontWeight: "bold" }}>93</Text>
        <Text style={{ fontSize: width * 0.08 }}>3rd Place</Text>
      </View>
      <View style={{ flex: 3 }}>
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
            styles.button,
          ]}
          onPress={() => {
            alert("press");
          }}>
          <Text style={{ color: "black" }}>Find Friends</Text>
        </Pressable>
      </View>
      <View style={styles.linkContainer}>
        <Pressable
          onPress={() => {
            Alert.prompt(
              "Enter new password",
              "",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: (password1) =>
                    Alert.prompt(
                    "Confirm new password",
                    "",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: (password2) =>
                          {if(password1 === password2) {
                            console.log("OK Pressed, password: " + password1);
                          } else {
                            alert("Passwords do not match. Please try again.");
                          }}
                      },
                    ],
                    "secure-text"
                  )
                },
              ],
              "secure-text"
            );
          }}>
          <Text style={{ color: "black", textDecorationLine: "underline" }}>
            Reset Password
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Alert.prompt(
              "Delete Account",
              "Are you sure you want to delete your profile? This action cannot be undone. Please enter your password to confirm.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: (password) =>
                    console.log("OK Pressed, password: " + password),
                },
              ],
              "secure-text"
            );
          }}>
          <Text style={{ color: "black", textDecorationLine: "underline" }}>
            Delete Account
          </Text>
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
    flex: 2,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  scoreContainer: {
    flex: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "white",
    height: 50,
    padding: 15,
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4F83A5",
  },
  linkContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: '15%',
  },
});
