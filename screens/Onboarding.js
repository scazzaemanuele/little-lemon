import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import Button from "../components/Button";
import { COLORS } from "../theme/colors";
import { TYPOGRAPHY } from "../theme/typography";
import { isValidEmail } from "../utils";
import { storeData } from "../storage/async";

export default function Onboarding() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const isValid = isValidEmail(email) && firstName.length > 0;

  const handlePress = () => {
    storeData("firstName", firstName);
    storeData("email", email);
    storeData("onboardingComplete", true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView style={styles.container} keyboardDismissMode="on-drag">
        <View style={styles.content}>
          <Text style={[TYPOGRAPHY.sectionHeader, styles.whiteColor]}>
            Let us get to know you
          </Text>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={[TYPOGRAPHY.lead, styles.whiteColor]}>
                First Name
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                inputMode="text"
              />
            </View>
            <View style={styles.formControl}>
              <Text style={[TYPOGRAPHY.lead, styles.whiteColor]}>E-mail</Text>
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Button disabled={!isValid} onPress={handlePress}>
            Next
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteColor: {
    color: "white",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  content: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  form: {
    paddingVertical: 40,
    rowGap: 20,
  },
  formControl: {
    rowGap: 10,
  },
  footer: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: "Karla-Regular",
    fontSize: 16,
    color: "white",
  },
});
