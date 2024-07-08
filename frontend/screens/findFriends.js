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
import { useState, useEffect } from 'react';
import { Snackbar } from "react-native-paper";
import { useAuth } from '../contextProviders/authContext';


export default function FindFriends({ navigation }) {
  const { width } = Dimensions.get("window");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);

  const { currentUser } = useAuth();

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");

  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  useEffect(() => {
    if (searchQuery == "") {
      return;
    }
    // fetch user data from backend
    fetch(`http://localhost:3000/search-friend/${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
    })
      .then((response) => {
        if (response.status == 404) {
          setFriends([]);
          return;
        }
        return response.json();
      })
      .then((data) => {
        setFriends(data);

        setIsLoading(false);
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("An error occurred.", error.message);
        navigation.navigate("LoggedInRoutes", { screen: "Home" });
        console.log(error);
      });
  }, [searchQuery]);

  handleSendRequest = (friendId) => {
    // send friend request
    fetch(`http://localhost:3000/send-friend-request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
      body: JSON.stringify({
        userId: currentUser.uid,
        friendId: friendId,
      }),
    })
      .then((response) => {
        if (response.status == 404) {
          setSnackBarVisible(true);
          setSnackbarMessage("An error occurred.");
          return;
        }
        return response.json();
      })
      .then((data) => {
        // remove friend from list
        const updatedList = friends.filter(
          (friend) => friend.user_id !== friendId
        );
        setFriends(updatedList);
        setSnackBarVisible(true);
        setSnackbarMessage("Request sent!");
      })
      .catch((error) => {
        setSnackBarVisible(true);
        setSnackbarMessage("An error occurred.", error.message);
        console.log(error);
      });
  }

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
        onChangeText={(text) => {
          if (text != "") {
            setIsLoading(true);
          } else {
            setIsLoading(false);
          }
          setSearchQuery(text);
        }}
        value={searchQuery}
        mode='view'
        loading={isLoading}
        style={{
          width: width * 0.8,
          marginBottom: "5%",
          backgroundColor: "#F2F2F2",
        }}
        rippleColor={"#4F83A5"}
        showDivider={false}
      />
      <Text style={{ fontSize: width * 0.05, color: "#4F83A5" }}>
        {!friends ? "No friends found" : null}
      </Text>
      <View style={styles.tableContainer}>
        <DataTable>
          <ScrollView>
            {friends?.map((item) => (
              <DataTable.Row key={item.user_id} style={styles.row}>
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
                      handleSendRequest(item.user_id);
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
