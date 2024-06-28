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
import { Searchbar } from "react-native-paper";
import { useState } from 'react';


export default function FindFriends() {
  const { width } = Dimensions.get("window");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const friends = [
    {
      id: 1,
      name: "John Doe",
      score: 100,
    },
    {
      id: 2,
      name: "Jane Doe",
      score: 200,
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
          Find Friends
        </Text>
      </View>
      <Searchbar
        placeholder='Search'
        onChangeText={(text)=>{
            if (text != "") {
              setLoading(true);
            } else {
              setLoading(false);
            }
            setSearchQuery(text)
          }
        }
        value={searchQuery}
        mode='view'
        loading={loading}
        style={{ width: width * 0.8,marginBottom: "5%", backgroundColor: "#F2F2F2"}}
        rippleColor={"#4F83A5"}
        showDivider={false}
      />
      <View style={styles.tableContainer}>
        <DataTable>
          <ScrollView>
            {friends.map((item) => (
              <DataTable.Row key={item.id} style={styles.row}>
                <DataTable.Cell style={{ flex: 2 }}>
                  <Text style={{ fontSize: width * 0.04 }}>{item.name}</Text>
                </DataTable.Cell>
                <DataTable.Cell
                  numeric
                  style={{ flex: 2, justifyContent: "center" }}>
                  <Text style={{ fontSize: width * 0.04 }}>{item.score}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 1 }}>
                  <Pressable
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.5 : 1.0, width: width * 0.7 },
                      styles.button,
                    ]}
                    onPress={() => {
                      console.log("Added");
                    }}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../assets/icons/add.png")}
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
