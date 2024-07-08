/* 
------------------ SOCIAL TASKER - Login -------------------
This is the login screen. It is the first screen that the user 
sees when they open the app.
**/

// Import necessary modules
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Pressable } from "react-native";
import { Dimensions } from "react-native";
import { useState } from 'react';
import {auth} from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Snackbar } from "react-native-paper";
import LoadingOverlay from '../components/loadingOverlay';
import { useConnectivity } from "../contextProviders/connectivityContext";

export default function Login({ navigation }) {
  const { width } = Dimensions.get("window");

  const { isConnected } = useConnectivity();

  if (!isConnected) {
    setSnackBarVisible(true);
    setSnackbarMessage("No internet connection.");
  }

  // State for email and password
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  // Sign in function
  const signIn = () => {
    setLoading(true);
    // Sign in with email and password from Firebase
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      setLoading(false);
      navigation.navigate("Login");
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      setSnackBarVisible(true);
      setSnackbarMessage("Error logging in.", error);
      // ..
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo/logoIcon.png")}
          style={{ width: width * 0.5, flex: 1 }}
          alt='Social Tasker logo icon'
        />
        <Image
          source={require("../assets/logo/logoText.png")}
          style={{ width: width * 0.5, resizeMode: "contain", flex: 1 }}
          alt='Social Tasker logo text'
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          mode='outlined'
          style={[styles.input, { width: width * 0.7 }]}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='Email'
          autoComplete='email'
        />
        <TextInput
          style={[styles.input, { width: width * 0.7 }]}
          onChangeText={onChangePassword}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoComplete='password'
        />
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
            styles.button,
          ]}
          onPress={() => {
            signIn();
          }}>
          <Text style={{ color: "white" }}>Sign In</Text>
        </Pressable>
      </View>
      <Text style={{ flex: 1 }}>
        Don't have an account?{" "}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => navigation.navigate("SignUp")}>
          Sign Up here.
        </Text>
      </Text>
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
      < LoadingOverlay visible={isLoading} />
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
  logoContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  formContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#828282",
    borderRadius: 8,
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