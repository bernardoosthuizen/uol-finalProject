/* 
------------------ SOCIAL TASKER - Login -------------------
This is the login screen. It is the first screen that the user 
sees when they open the app.
**/

// Import necessary modules
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Dimensions } from "react-native";
import { useState, useEffect } from 'react';
import {auth} from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Snackbar } from "react-native-paper";
import LoadingOverlay from '../components/loadingOverlay';
import { useConnectivity } from "../contextProviders/connectivityContext";

export default function Login({ navigation }) {
  // State and screen constants
  const { width } = Dimensions.get("window");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { isConnected } = useConnectivity();

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  // State for email and password
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger form validation when task data changes
    validateLoginData();
  }, [email, password]);

  const validateLoginData = () => {
    let errors = {};
    


    // Check internet connection
    if (!isConnected) {
      errors.connection = "No internet connection."
      return;
    }

    // Validate email field
    if (!email) {
      errors.email = "Email is required.";
    } else {
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

      if (!validateEmail(email)) {
        errors.email = "Invalid email address.";
      }
    }
    // Validate password field
    if (!password) {
      errors.password = "Password is required.";
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  // Sign in function
  const signIn = () => {
    setLoading(true);
    if (!isFormValid) {
      console.log(errors);
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
    // Sign in with email and password from Firebase
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      setLoading(false);
      navigation.navigate("Login");
      const errorMessage = error.message;
      setSnackBarVisible(true);
      if (errorMessage == "Firebase: Error (auth/invalid-email).") {
        setSnackbarMessage("Wrong email. ");
      } else if (errorMessage == "Firebase: Error (auth/invalid-credential).") {
        setSnackbarMessage("Incorrect password.");
      } else {
        setSnackbarMessage(`Error logging in. ${errorMessage}`);
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <SafeAreaView style={{ alignItems: "center" }}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo/logoIcon.png")}
              style={{ width: width * 0.5, flex: 1, resizeMode: "contain" }}
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
              style={[styles.input, { width: width * 0.8 }]}
              onChangeText={onChangeEmail}
              onSubmitEditing={() => {
                this.secondTextInput.focus();
              }}
              autoCorrect={false}
              value={email}
              placeholder='Email'
              placeholderTextColor='lightgrey'
              autoComplete='email'
            />
            <TextInput
              style={[styles.input, { width: width * 0.8 }]}
              onChangeText={onChangePassword}
              autoCorrect={false}
              onSubmitEditing={signIn}
              value={password}
              secureTextEntry={true}
              placeholder='Password'
              placeholderTextColor='lightgrey'
              autoComplete='password'
              ref={(input) => {
                this.secondTextInput = input;
              }}
            />
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0, width: width * 0.8 },
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

          <StatusBar style='dark-content' />
        </SafeAreaView>
        <LoadingOverlay visible={isLoading} />
      </KeyboardAvoidingView>
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
    justifyContent: "center",
    height: 50,
    padding: 10,
    margin: 12,
    borderRadius: 8,
  },
});