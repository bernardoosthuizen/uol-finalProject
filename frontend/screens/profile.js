/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable,
} from "react-native";
import { Dimensions, Alert } from "react-native";
import { useAuth } from '../contextProviders/authContext';
import { Snackbar } from "react-native-paper";


export default function Profile() {
  const { width } = Dimensions.get("window");
  const { logout, deleteAccount, resetPassword, currentUser } = useAuth();
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");

  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  useEffect(() => {
    // fetch user data from backend
    fetch(`http://localhost:3000/user/${currentUser.uid}`, {
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
        setUserData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to get profile", error.message);
        navigation.navigate("LoggedInRoutes", { screen: "Home" });
        console.log(error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Call logout
      console.log("Logged out successfully");
      // Redirect user or update UI accordingly

    } catch (error) {
      setSnackBarVisible(true);
      setSnackbarMessage("Failed to log out", error);
    }
  };

  const handleDeleteAccount = async (password) => {
    // UserId from context
    const userId = currentUser.uid;
    
    deleteAccount(password)
    .then(()=>{
      console.log("Account deleted successfully", userId);
    })
    .catch((error) => {
      console.error("Error during account deletion:", error);
      setSnackBarVisible(true);
      setSnackbarMessage("Failed to delete account", error.message);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontSize: width * 0.06,
            color: "#4F83A5",
            fontWeight: "bold",
          }}>
          {userData ? userData.name : "Loading..."}
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={{ fontSize: width * 0.05 }}>
          {userData?.score ? "Score" : "No Score"}
        </Text>
        <Text style={{ fontSize: width * 0.3, fontWeight: "bold" }}>
          {userData ? userData.score : null}
        </Text>
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
            Alert.alert("Logout", "Are you sure you want to logout?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => handleLogout(),
              },
            ]);
          }}>
          <Text style={{ color: "black", textDecorationLine: "underline" }}>
            Logout
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Alert.alert(
              "Are you Sure you want to reset your password?",
              "An email will be sent to your email address with a link to reset your password. Please enter your new password.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "YES",
                  onPress: () => {
                    try {
                      resetPassword();
                    } catch (error) {
                      setSnackBarVisible(true);
                      setSnackbarMessage("Failed to reset password", error);
                    }
                  },
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
                  text: "Yes",
                  style: "destructive",
                  onPress: (password) => handleDeleteAccount(password),
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
    flex: 2,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: '15%',
  },
});
