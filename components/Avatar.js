import { Image, Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { getData } from "../storage/async";
import { COLORS } from "../theme/colors";
import { TYPOGRAPHY } from "../theme/typography";
import { appBus } from "../event-bus/app-bus";

export default function Avatar() {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

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

  return image ? (
    <Image source={{ uri: image }} style={styles.avatar} resizeMode="contain" />
  ) : (
    <View style={styles.avatarPlaceholder}>
      <Text style={styles.placeholderLabel}>
        {firstName?.[0]?.toUpperCase()}
        {lastName?.[0]?.toUpperCase()}
      </Text>
    </View>
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
    ...TYPOGRAPHY.heading,
    color: "white",
    textAlign: "center",
  },
});
