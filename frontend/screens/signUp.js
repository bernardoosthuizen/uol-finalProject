/* 
----------------- SOCIAL TASKER - Sign Up ------------------
This is the sign up screen. It is the screen that the user
sees when they want to create a new account.
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
} from "react-native";
import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import {auth} from '../services/firebaseConfig';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { Snackbar } from "react-native-paper";
import LoadingOverlay from "../components/loadingOverlay";
import { useAuth } from '../contextProviders/authContext';


export default function Login({ navigation }) {
  const { width } = Dimensions.get("window");

  // State for name, email and password
  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const { apiUrl } = useAuth();

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  useEffect(() => {
    // Trigger form validation when task data changes
    validateSignupData();
  }, [email, password, name]);

  const validateSignupData = () => {
    let errors = {};

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
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    // Validate name field
    if (!name) {
      errors.name = "Name is required.";
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  // Sign up function
  const signUp = () => {
    setLoading(true);
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
    // Sign up with email and password from Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Find Friends", { signUpFlow: true });
        // Send post request to backend
        // this stores the user in the neo4j, firestore and realtime databases
        const user_id = userCredential.user.uid;
        const userData = { name, email, user_id };
        fetch(`${apiUrl}/api/create-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
          },
          body: JSON.stringify(userData),
        });
      })
      .catch((error) => {
        isLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to sign up.", errorMessage);
        console.log(errorMessage);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo/logoHorizontal.png")}
            style={{ width: width * 0.75, flex: 1, resizeMode: "contain" }}
            alt='Social Tasker logo icon'
          />
        </View>
        <View style={styles.ctaContainer}>
          <Text style={[styles.ctaText, { fontSize: width * 0.1 }]}>
            Sign Up{" "}
          </Text>
          <Text style={[styles.ctaText, { fontSize: width * 0.055 }]}>
            and motivate your friends to be more productive!{" "}
          </Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            mode='outlined'
            style={[styles.input, { width: width * 0.8 }]}
            onChangeText={onChangeName}
            autoCorrect={false}
            value={name}
            placeholder='Username'
            placeholderTextColor='lightgrey'
            autoComplete='username'
          />
          <TextInput
            mode='outlined'
            style={[styles.input, { width: width * 0.8 }]}
            onChangeText={onChangeEmail}
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
            onSubmitEditing={signUp}
            value={password}
            secureTextEntry={true}
            placeholder='Password'
            placeholderTextColor='lightgrey'
            autoComplete='password'
          />
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1.0, width: width * 0.8 },
              styles.button,
            ]}
            onPress={() => {
              signUp();
            }}>
            <Text style={{ color: "white" }}>Sign Up</Text>
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
        <StatusBar style='auto' />
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
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaContainer: {
    flex: 2,
    width: "80%",
    justifyContent: "center",
  },
  ctaText: {
    color: "#4F83A5",
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 40,
  },
  formContainer: {
    flex: 3,
    alignItems: "center",
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
