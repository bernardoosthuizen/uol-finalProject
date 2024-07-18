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
import { useAuth } from '../contextProviders/authContext';


export default function LeaderboardListComponent({ users }) {
    const { width } = Dimensions.get("window");
    const { currentUser } = useAuth();
    // Order users by score
    users?.sort((a, b) => b.score - a.score);
    // Add rank to each user
    users?.forEach((user, index) => {
      user.rank = index + 1;
    });
    console.log(users);
    
    if (users?.length == 1 || users?.length == 0) {
      return (
        <View style={styles.messageContainer}>
          <Text style={{color: "grey"}}>Add friends to see their scores.</Text>
        </View>
          
      );
    }

    return (
      <DataTable>
        <ScrollView>
          {users?.map((item) => (
            <DataTable.Row key={item.user_id} style={styles.row}>
              <DataTable.Cell style={{ flex: 1 }}>
                <Text style={{ fontSize: width * 0.05 }}>{item.rank}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 2 }}>
                {item.user_id == currentUser.uid ? (
                  <Text style={{ fontSize: width * 0.05, fontWeight: "bold" }}>
                    Me
                  </Text>
                ) : (
                  <Text style={{ fontSize: width * 0.05 }}>
                    {item.name}
                  </Text>
                )}
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 2 }}>
                <Text style={{ fontSize: width * 0.05 }}>{item.score}</Text>
              </DataTable.Cell>
            </DataTable.Row>
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