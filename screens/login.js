/* 
------------------ SOCIAL TASKER - Login -------------------
This is the login screen. It is the first screen that the user 
sees when they open the app.
**/
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Pressable } from "react-native";
import { Dimensions } from "react-native";
import { useState } from 'react';

export default function Login({ navigation }) {
    const {width} = Dimensions.get('window');

    const [email, onChangeEmail] =useState('');
    const [password, onChangePassword] =useState('');
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
            alert("press");
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
    height: 40,
    padding: 10,
    margin: 12,
    borderRadius: 8,
  },
});