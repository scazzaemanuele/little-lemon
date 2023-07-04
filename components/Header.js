import { View, Image, StyleSheet } from "react-native";

export const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo.png")} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "auto",
  },
});
