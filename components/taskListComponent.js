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
import { useState } from 'react';


export default function TaskListComponent({ tasks, header, navigation }) {
    const { width } = Dimensions.get("window");

    const [sortDateDirection, setSortDateDirection] = useState(null);
    const [sortPriorityDirection, setSortPriorityDirection] = useState(null);

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
                    sortDateDirection === "ascending"
                        ? "descending"
                        : "ascending"
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
                navigation.navigate("Task", { taskId: item.id });
              }}>
              <DataTable.Row key={item.id} style={styles.row}>
                <DataTable.Cell style={{ flex: 2 }}>
                  {/* Set image based on priority */}
                  {item.prority === "high" ? (
                    <Image
                      source={require("../assets/icons/high-priority.png")}
                      style={{
                        resizeMode: "contain",
                      }}
                      alt='priority icon'
                    />
                  ) : item.prority === "medium" ? (
                    <Image
                      source={require("../assets/icons/medium-priority.png")}
                      style={{
                        resizeMode: "contain",
                      }}
                      alt='priority icon'
                    />
                  ) : (
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
                    <Text style={{ fontSize: width * 0.04 }}>Today</Text>
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