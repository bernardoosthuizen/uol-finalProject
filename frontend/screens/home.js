/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

// Import necessary modules
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
} from "react-native";
import { Dimensions } from "react-native";
import { DataTable } from "react-native-paper";
import { Snackbar } from "react-native-paper";
import { useEffect, useState } from "react";
// import custom components
import TaskListComponent from '../components/taskListComponent';
import LeaderboardListComponent from '../components/leaderboardListComponent';
import LoadingOverlay from "../components/loadingOverlay";

import { useAuth } from '../contextProviders/authContext';


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
  const { currentUser } = useAuth();
  const [dashData, setDashData] = useState({});

  const [isLoading, setLoading] = useState(false);

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  // get dashboard data
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/dashboard/${currentUser.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDashData(data);
        setLoading(false);
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("Failed to get dashboard.", error.message);
        console.error("Failed to get dashboard data", error.message);
      });
  }, []);

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
            <LeaderboardListComponent users={dashData.friends} />
          </DataTable>
        </View>
      </View>
      <View style={styles.tasksContainer}>
        <Text style={styles.titleText}>My Tasks</Text>
        <View>
          <TaskListComponent tasks={dashData.tasks} navigation={navigation} />
        </View>
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
