import { View, ActivityIndicator, StyleSheet } from "react-native";

function LoadingOverlay(){
    console.log(' LoadingOverlay: Loading')
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size='large' color='#4F83A5' />
      </View>
    );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    color: "black",
  },
});

export default LoadingOverlay;
