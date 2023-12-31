import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { getData } from "../storage/async";
import { COLORS } from "../theme/colors";
import { TYPOGRAPHY } from "../theme/typography";
import { appBus } from "../event-bus/app-bus";
import { useNavigation } from "@react-navigation/native";

export default function Avatar() {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = () => {
      getData("avatar").then(setImage);
      getData("firstName").then(setFirstName);
      getData("lastName").then(setLastName);
    };
    loadData();
    const unsubscribe = appBus.on("profile-updated", loadData);

    return () => unsubscribe();
  }, []);

  const Component = image ? (
    <Image source={{ uri: image }} style={styles.avatar} resizeMode="contain" />
  ) : (
    <View style={styles.avatarPlaceholder}>
      <Text style={styles.placeholderLabel}>
        {firstName?.[0]?.toUpperCase()}
        {lastName?.[0]?.toUpperCase()}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      {Component}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderLabel: {
    ...TYPOGRAPHY.sectionHeader,
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});
