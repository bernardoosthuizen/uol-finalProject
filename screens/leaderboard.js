/* 
-------------------- SOCIAL TASKER - Leaderboard ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { Dimensions } from "react-native";
import LeaderboardListComponent from '../components/leaderboardListComponent';

export default function Leaderboard({ navigation }) {
  const leaderdata = [
    { name: "Devin", rank: 1, score: 50, id: 234 },
    { name: "Dan", rank: 2, score: 50, id: 234 },
    { name: "Dominic", rank: 3, score: 50, id: 234 },
    { name: "Jackson", rank: 4, score: 50, id: 234 },
    { name: "James", rank: 5, score: 50, id: 234 },
    { name: "Devin", rank: 1, score: 50, id: 234 },
    { name: "Dan", rank: 2, score: 50, id: 234 },
    { name: "Dominic", rank: 3, score: 50, id: 234 },
    { name: "Jackson", rank: 4, score: 50, id: 234 },
    { name: "James", rank: 5, score: 50, id: 234 },
    { name: "Devin", rank: 1, score: 50, id: 234 },
    { name: "Dan", rank: 2, score: 50, id: 234 },
    { name: "Dominic", rank: 3, score: 50, id: 234 },
    { name: "Jackson", rank: 4, score: 50, id: 234 },
    { name: "James", rank: 5, score: 50, id: 234 },
    { name: "Devin", rank: 1, score: 50, id: 234 },
    { name: "Dan", rank: 2, score: 50, id: 234 },
    { name: "Dominic", rank: 3, score: 50, id: 234 },
    { name: "Jackson", rank: 4, score: 5, id: 234 },
    { name: "James", rank: 5, score: 50, id: 234 },
  ];

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
        <LeaderboardListComponent users={leaderdata} />
      </View>
      <Pressable style={{flex: 1, justifyContent: 'center'}} onPress={()=>alert('pressed')}>
        <Text style={{fontSize: width * 0.05, textDecorationLine: "underline"}}>Find Friends</Text>
      </Pressable>
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
