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
} from "react-native";
import { Dimensions } from "react-native";
import { useState } from "react";
import {auth} from '../services/firebaseConfig';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { Snackbar } from "react-native-paper";
import LoadingOverlay from "../components/loadingOverlay";


export default function Login({ navigation }) {
  const { width } = Dimensions.get("window");

  // State for name, email and password
  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  // Sign up function
  const signUp = () => {
    setLoading(true);
    // Sign up with email and password from Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Find Friends", { signUpFlow: true });
        // Send post request to backend
        // this stores the user in the neo4j, firestore and realtime databases
        const user_id = userCredential.user.uid;
        const userData = { name, email, user_id };
        fetch("http://localhost:3000/api/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
          },
          body: JSON.stringify(userData),
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to sign up.", errorMessage);
        console.log(errorMessage);
      });
  };

  return (
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
          value={name}
          placeholder='Username'
          placeholderTextColor='lightgrey'
          autoComplete='username'
        />
        <TextInput
          mode='outlined'
          style={[styles.input, { width: width * 0.8 }]}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='Email'
          placeholderTextColor='lightgrey'
          autoComplete='email'
        />
        <TextInput
          style={[styles.input, { width: width * 0.8 }]}
          onChangeText={onChangePassword}
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
