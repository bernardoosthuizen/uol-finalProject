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
  Image,
  Pressable,
} from "react-native";
import { Dimensions } from "react-native";
import TaskListComponent from '../components/taskListComponent';

export default function Tasks({ navigation }) {

  const taskdata = [
    { title: "Devin", prority: "high", due: 50, id: 123 },
    { title: "Dan", prority: "medium", due: 50, id: 35 },
    { title: "Dominic", prority: "high", due: 50, id: 365 },
    { title: "Jackson", prority: "medium", due: 50, id: 4783 },
    { title: "James", prority: "low", due: 50, id: 487 },
    
  ];


  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: width * 0.06, color: "#4F83A5", fontWeight: "bold" }}>
          My Tasks
        </Text>
      </View>
      <View style={{ flex: 9, width: width * 0.9, marginVertical: "5%" }}>
        <TaskListComponent tasks={taskdata} header={true}/>
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
    flex: 1,
    width: '80%',
    flexDirection: "row", 
    alignItems: "center",
  },
});
