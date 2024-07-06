/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
} from "react-native";
import { Dimensions } from "react-native";
import { DataTable } from "react-native-paper";
import TaskListComponent from '../components/taskListComponent';
import LeaderboardListComponent from '../components/leaderboardListComponent';


export function LeaderItem ({ item }) {
    return (
        <View>
            <Text>{item.rank}</Text>
            <Text>{item.name}</Text>
            <Text>{item.score}</Text>
        </View>
    );
}

export default function Home({ navigation }) {
  const { width } = Dimensions.get("window");

  const leaderdata=[
              { name: "Devin", rank: 1, score: 50 },
              { name: "Dan", rank: 2, score: 50 },
              { name: "Dominic", rank: 3, score: 50 },
              { name: "Jackson", rank: 4, score: 50 },
              { name: "James", rank: 5, score: 50 },
            ]

    const taskdata = [
      { title: "Devin", prority: "high", due: 50, id: 123 },
      { title: "Dan", prority: "medium", due: 50, id: 35 },
      { title: "Dominic", prority: "high", due: 50, id: 365 },
      { title: "Jackson", prority: "medium", due: 50, id: 4783 },
      { title: "James", prority: 'low', due: 50, id: 487 },
    ];

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/logo/logoHorizontal.png")}
        style={{ width: width * 0.75, flex: 1, resizeMode: "contain" }}
        alt='Social Tasker logo icon'
      />
      <View style={styles.leaderboardContainer}>
        <Text style={styles.titleText}>Leader-board</Text>
        <View>
          <DataTable>
            <LeaderboardListComponent users={leaderdata}/>
          </DataTable>
        </View>
      </View>
      <View style={styles.tasksContainer}>
        <Text style={styles.titleText}>My Tasks</Text>
        <View>
          {/* <TaskListComponent tasks={taskdata} navigation={navigation}/> */}
        </View>
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
  titleText: {
    color: "#4F83A5",
    fontSize: "20%",
    marginVertical: "5%",
  },
  leaderboardContainer: {
    width: "85%",
    flex: 4,
  },
  row: {
    width: "100%",
    borderBottomWidth: 0,
  },
  tasksContainer: {
    width: "85%",
    flex: 4,
  },
});
