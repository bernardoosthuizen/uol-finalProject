/* 
----------------- SOCIAL TASKER - Sign Up ------------------
This is the sign up screen. It is the screen that the user
sees when they want to create a new account.
**/

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

export default function Login({ navigation }) {
  const { width } = Dimensions.get("window");

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
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
          style={[styles.input, { width: width * 0.7 }]}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='Username'
          autoComplete='username'
        />
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
            alert("press");
          }}>
          <Text style={{ color: "white" }}>Sign Up</Text>
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
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaContainer: {
    flex: 2,
    width: "70%",
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
    height: 40,
    padding: 10,
    margin: 12,
    borderRadius: 8,
  },
});
