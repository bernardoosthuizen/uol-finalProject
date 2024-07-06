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

  useEffect(() => {
    if (sortDateDirection === "descending") {
      tasks = tasks.reverse(); // Sort the copy
    }
    if (sortDateDirection === "ascending") {
      tasks = tasks.reverse(); // Sort the copy
    }
    // Add any other sorting logic here
  }, [tasks, sortDateDirection]); // Re-run this effect if tasks or sortPriorityDirection changes

  setDateText = (date) => {
    console.log(date, );
    let newDate = new Date(date).toDateString();
    console.log(newDate);
    let today = new Date().toDateString();
    if (today == newDate) {
      return "Today";
    }
    if (date < Date.parse(today)) {
      return "Overdue";
    }
    if (date == Date.parse(today) + 86400000) {
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
        {tasks.map((item) => (
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
                <Text style={{ fontSize: width * 0.04 }}>{item.title}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 3, flexDirection: "row" }}>
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
        ))}
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
  row: {
    width: "100%",
    borderBottomWidth: 0,
  },
});