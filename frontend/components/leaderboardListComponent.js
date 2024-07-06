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


export default function LeaderboardListComponent({ users }) {
    const { width } = Dimensions.get("window");

    // Order users by score
    users.sort((a, b) => b.score - a.score);
    // Add rank to each user
    users.forEach((user, index) => {
      user.rank = index + 1;
    });

    return (
      <DataTable>
        <ScrollView>
          {users.map((item) => (
            <DataTable.Row key={item.user_id} style={styles.row}>
              <DataTable.Cell style={{ flex: 1 }}>
                <Text style={{ fontSize: width * 0.05 }}>{item.rank}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 2 }}>
                <Text style={{ fontSize: width * 0.05 }}>{item.name}</Text>
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
  row: {
    width: "100%",
    borderBottomWidth: 0,
  },
});