/* 
-------------------- SOCIAL TASKER - Friend Request ---------------------
This is the friend request screen. It is the screen that displays all the 
friend requests received by the user
**/

import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable,
    ScrollView,
    Image,
} from "react-native";
import { Dimensions  } from "react-native";
import { DataTable } from "react-native-paper";


export default function FriendRequest() {
  const { width } = Dimensions.get("window");

  const requests = [
    {
      id: 1,
      name: "John Doe",
    },
    {
      id: 2,
      name: "Jane Doe",
    }
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontSize: width * 0.06,
            color: "#4F83A5",
            fontWeight: "bold",
          }}>
          Friend Requests
        </Text>
      </View>
      <View style={styles.tableContainer}>
        <DataTable>
          <ScrollView>
            {requests.map((item) => (
              <DataTable.Row key={item.id} style={styles.row}>
                <DataTable.Cell style={{ flex: 4 }}>
                  <Text style={{ fontSize: width * 0.04 }}>{item.name}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  <Pressable
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
                      styles.button,
                    ]}
                    onPress={() => {
                      console.log("Accept");
                    }}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../assets/icons/accept.png")}
                    />
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  <Pressable
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
                      styles.button,
                    ]}
                    onPress={() => {
                      console.log("Reject");
                    }}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../assets/icons/reject.png")}
                    />
                  </Pressable>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
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
    flexDirection: "row",
    alignItems: "center",
  },
  tableContainer: {
    flex: 15,
    width: "80%",
    alignItems: "center",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  row: {
    height: 50,
    width: "100%",
    borderBottomWidth: 0,
  },
});
