import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { Dimensions } from "react-native";

export default function Home({ navigation }) {
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={styles.container}>
        <Text>
            Home
        </Text>
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
});
