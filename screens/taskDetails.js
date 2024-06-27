/* 
-------------------- SOCIAL TASKER - Home ---------------------
This is the home screen. It is the screen that the user sees
when they are logged in.
**/

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Pressable, Alert, Image } from "react-native";

export default function Task({route, navigation}) {

  
    
  const {taskId} = route.params;
  const date = new Date();
  const taskdata = {
    title: 'Glo',
    prority: "high",
    taskDue: date.toISOString(),
    description: "This is a description of the task",
    details:
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.",
    id: taskId,
  };

  const displayDate = (date) => {
    const d = new Date(date);
    return d.toDateString();
  };

   const newDate = displayDate(taskdata.taskDue);


    const { width, height } = Dimensions.get("window");
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: width * 0.06,
              color: "#4F83A5",
              fontWeight: "bold",
              marginBottom: "5%",
            }}>
            {taskdata.title}
          </Text>
          <Text style={{
              fontSize: width * 0.04,
            }}>{taskdata.description}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Image
            source={require("../assets/icons/calendar.png")}
            style={{ width: 20, height: 20, marginRight: "5%"}}
          />
          <Text >{newDate}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text>{taskdata.details}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
              styles.button,
            ]}
            onPress={() => {
              alert("press");
            }}>
            <Text style={{ color: "white" }}>Complete</Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, alignItems: "center", marginTop: "5%" }}
            onPress={() => {
              navigation.navigate("Edit Task", { taskdata: taskdata});
            }}>
            <Text style={{ color: "black", textDecorationLine: "underline" }}>
              Edit Task
            </Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => {
              Alert.alert(
                'Delete Task',
                `Do you want to delete ${taskdata.title}?`,
                [
                  {
                    text: 'NO',
                    style: 'cancel'
                  },
                  { text: 'YES', onPress: () => console.log('OK Pressed') }
                ],
              )
            }}>
            <Text style={{ color: "black", textDecorationLine: "underline" }}>
              Delete Task
            </Text>
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
  titleContainer: {
    flex: 2,
    width: "80%",
    justifyContent: "center",
  },
  dateContainer: {
    flex: 1,
    width: "80%",
    flexDirection: "row",
    alignContent: "center",

  },
  detailsContainer: {
    flex: 4,
    width: "80%",
  },
  actionsContainer: {
    flex: 2,
    width: "80%",
    alignContent: "center",
    justifyContent: "center",
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
