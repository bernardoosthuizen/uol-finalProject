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
    Pressable
} from "react-native";
import { Dimensions, Alert } from "react-native";
import { useAuth } from '../contextProviders/authContext';


export default function Profile() {
  const { width } = Dimensions.get("window");
  const { logout, deleteAccount, resetPassword } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Call logout
      console.log("Logged out successfully");
      // Redirect user or update UI accordingly

    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      await deleteAccount(password); // Call deleteAccount
      console.log("Account deleted successfully");
      // Redirect user or update UI accordingly
    } catch (error) {
      console.error("Failed to delete account", error);
    }
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
          JOHNDOE
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
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => handleLogout() ,
                },
              ]
            );
          
          }
          }
        >
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
                      console.error("Failed to reset password", error);
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
                  onPress: (password) =>
                    handleDeleteAccount(password),
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
    flex: 2,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: '15%',
  },
});
