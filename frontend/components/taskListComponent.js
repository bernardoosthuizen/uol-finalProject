import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView
} from "react-native";
import { Dimensions } from "react-native";
import { DataTable } from "react-native-paper";
import { useState, useEffect } from 'react';


export default function TaskListComponent({ tasks, header, navigation }) {
  const { width } = Dimensions.get("window");

  const [sortDateDirection, setSortDateDirection] = useState("descending");
  const [sortPriorityDirection, setSortPriorityDirection] = useState(null);

  let sortedTasks = tasks;

  useEffect(() => {
    
    if (!header) {
      sortedTasks = sortedTasks?.reverse();
    }  
    if (sortDateDirection === "descending") {
      sortedTasks = sortedTasks?.reverse(); // Sort the copy
    }
    if (sortDateDirection === "ascending") {
      sortedTasks = sortedTasks?.reverse(); // Sort the copy
    }
    // Add any other sorting logic here
  }, [tasks, sortDateDirection]); // Re-run this effect if tasks or sortPriorityDirection changes

  setDateText = (date) => {
    let newDate = new Date(date).toDateString();
    let today = new Date().toDateString();
    if (today == newDate) {
      return "Today";
    }
    if (date < Date.parse(today)) {
      return "Overdue";
    }
    if (date >= Date.parse(today) + 86400 * 1000 && date < Date.parse(today) + 172800 * 1000){
      return "Tomorrow";
    }
    // if its within 7 days
    if (date < Date.parse(today) + 604800000) {
      return newDate.split(" ").slice(0, 1).join(" ");
    }
    // if its next year return month and year
    if (new Date().getFullYear() < new Date(date).getFullYear()) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      let formattedDate = `${months[new Date(date).getMonth()]} ${new Date(
        date
      ).getFullYear()}`;
      return formattedDate;
    }
    return newDate.split(" ").slice(1, 3).join(" ");

  };

  function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
      return title.substring(0, maxLength - 3) + "...";
    } else {
      return title;
    }
  }

  // Remove all completed tasks from the list
  tasks = tasks?.filter((task) => task.status != "completed");

  if (tasks?.length == 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={{ color: "grey" }}>No tasks yet :(</Text>
      </View>
    );
  }

  return (
    <DataTable>
      {header ? (
        <DataTable.Header>
          <Pressable
            style={{ flex: 2 }}
            onPress={() => {
              setSortPriorityDirection(
                sortPriorityDirection === "ascending"
                  ? "descending"
                  : "ascending"
              );
              setSortDateDirection(null);
            }}>
            <DataTable.Title sortDirection={sortPriorityDirection}>
              Priority
            </DataTable.Title>
          </Pressable>
          <DataTable.Title style={{ flex: 3 }}>Task</DataTable.Title>
          <Pressable
            style={{ flex: 3 }}
            onPress={() => {
              setSortDateDirection(
                sortDateDirection === "ascending" ? "descending" : "ascending"
              );
              setSortPriorityDirection(null);
            }}>
            <DataTable.Title numeric sortDirection={sortDateDirection}>
              Due
            </DataTable.Title>
          </Pressable>
        </DataTable.Header>
      ) : null}
      <ScrollView>
        {tasks?.map((item) =>
          // Skip tasks that are already completed
            <Pressable
              key={item.id}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
              onPress={() => {
                navigation.navigate("Task", { taskId: item.id, goBack: true });
              }}>
              <DataTable.Row key={item.id} style={styles.row}>
                <DataTable.Cell style={{ flex: 2 }}>
                  {/* Set image based on priority */}
                  {item.priority === "high" && (
                    <Image
                      source={require("../assets/icons/high-priority.png")}
                      style={{
                        resizeMode: "contain",
                      }}
                      alt='priority icon'
                    />
                  )}
                  {item.priority === "medium" && (
                    <Image
                      source={require("../assets/icons/medium-priority.png")}
                      style={{
                        resizeMode: "contain",
                      }}
                      alt='priority icon'
                    />
                  )}
                  {item.priority === "low" && (
                    <Image
                      source={require("../assets/icons/low-priority.png")}
                      style={{
                        resizeMode: "contain",
                      }}
                      alt='priority icon'
                    />
                  )}
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 3 }}>
                  <Text style={{ fontSize: width * 0.04 }}>
                    {truncateTitle(item.title, 35)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell
                  numeric
                  style={{ flex: 3, flexDirection: "row" }}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Image
                      source={require("../assets/icons/calendar.png")}
                      style={{
                        width: width * 0.01,
                        flex: 1,
                        resizeMode: "contain",
                      }}
                      alt='Calendar icon'
                    />
                    <Text style={{ fontSize: width * 0.04 }}>
                      {setDateText(item.due_date)}
                    </Text>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            </Pressable>
        )}
      </ScrollView>
    </DataTable>
  );
}

const styles = StyleSheet.create({
  titleText: {
    color: "#4F83A5",
    fontSize: "20%",
    marginVertical: "5%",
  },
  messageContainer: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    width: "100%",
    borderBottomWidth: 0,
  },
});