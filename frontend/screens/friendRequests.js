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
import { useEffect, useState } from 'react';
import { useAuth } from '../contextProviders/authContext';
import { Snackbar } from "react-native-paper";


export default function FriendRequest({ route, navigation }) {
  const { width } = Dimensions.get("window");
  const friendRequests = route.params.friendRequests;
  const [requestList, setRequestList] = useState([]);
  const { currentUser, apiUrl } = useAuth();

  // Snack bar state
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Placeholder message");
  const onDismissSnackBar = () => setSnackBarVisible(!snackBarVisible);

  // Get friend details from
  useEffect(() => {
    fetch(`${apiUrl}/api/search-friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
      },
      body: JSON.stringify({
        userIds: friendRequests,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRequestList(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Failed to get friend requests", error.message);
        setSnackBarVisible(true);
        setSnackbarMessage("Oops", error.message);
      });
  }, []);

  handleAccept = (friendId) => {
    fetch(`${apiUrl}/api/add-friend`, {
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
        return response.json();
      })
      .then((data) => {
        // Remove the friend request from the list
        const updatedList = requestList.filter(
          (requestItem) => requestItem.user_id !== friendId
        );
        setRequestList(updatedList);
        setSnackBarVisible(true);
        setSnackbarMessage("Friend added!");
        if (updatedList.length === 0) {
          navigation.navigate("Home");
        }
      })
      .catch((error) => {
        console.error("Failed to accept friend request", error.message);
        setSnackBarVisible(true);
        setSnackbarMessage("Oops", error.message);
      });
  };

  handleReject = (friendId) => {
    console.log("Reject", friendId);
    fetch(
      `${apiUrl}/api/reject-friend-request/${currentUser.uid}/${friendId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.EXPO_PUBLIC_CREATE_API_KEY,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        } else {
          return response;
        }
      })
      .then((data) => {
        // Remove the friend request from the list
        const updatedList = requestList.filter(
          (requestItem) => requestItem.user_id !== friendId
        );
        setRequestList(updatedList);
        setSnackBarVisible(true);
        setSnackbarMessage("Friend request rejected!");
        if (updatedList.length === 0) {
          navigation.navigate("Home");
        }
      })
      .catch((error) => {
        console.error("Failed to reject friend request", error.message);
        setSnackBarVisible(true);
        setSnackbarMessage("Oops", error.message);
      });
  };

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
            {requestList.map((item) => (
              <DataTable.Row key={item.user_id} style={styles.row}>
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
                      handleAccept(item.user_id);
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
                      handleReject(item.user_id);
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
