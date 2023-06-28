import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { COLORS } from "../theme/colors";
import { getData, storeData } from "../storage/async";
import { TYPOGRAPHY } from "../theme/typography";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { appBus } from "../event-bus/app-bus";

const Input = (props) => {
  const { label, value, onValueChange } = props;

  return (
    <View>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onValueChange}
      />
    </View>
  );
};

const CheckBoxInput = (props) => {
  const { label } = props;
  const [isChecked, setChecked] = useState(true);

  return (
    <View style={styles.checkboxWrapper}>
      <Checkbox
        color={COLORS.accent}
        value={isChecked}
        onValueChange={setChecked}
      />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
  );
};

export default function Profile() {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const loadData = () => {
    getData("firstName").then(setFirstName);
    getData("lastName").then(setLastName);
    getData("email").then(setEmail);
    getData("phone").then(setPhone);
    getData("avatar").then(setImage);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveChanges = () => {
    storeData("firstName", firstName);
    storeData("lastName", lastName);
    storeData("email", email);
    storeData("phone", phone);
    storeData("avatar", image);
    appBus.emit("profile-updated");
    Alert.alert("Success", "Your profile has been updated");
  };

  const clearData = () => {
    storeData("firstName", null);
    storeData("lastName", null);
    storeData("email", null);
    storeData("phone", null);
    storeData("avatar", null);
    storeData("onboardingComplete", false);
    appBus.emit("profile-updated");
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
    >
      <Text style={TYPOGRAPHY.sectionHeader}>Personal Information</Text>
      <View style={styles.section}>
        <View>
          <Text style={styles.inputLabel}>Avatar</Text>
          <View style={styles.avatarSection}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.avatar}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.placeholderLabel}>
                  {firstName?.[0]?.toUpperCase()}
                  {lastName?.[0]?.toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.avatarButtonsWrapper}>
              <Button type="alternate" onPress={pickImage}>
                Change
              </Button>
              <Button type="outline" onPress={() => setImage(null)}>
                Remove
              </Button>
            </View>
          </View>
        </View>
        <Input
          label="First name"
          value={firstName}
          onValueChange={setFirstName}
        />
        <Input label="Last name" value={lastName} onValueChange={setLastName} />
        <Input label="Email" value={email} onValueChange={setEmail} />
        <Input label="Phone number" value={phone} onValueChange={setPhone} />
      </View>
      <Text style={TYPOGRAPHY.sectionHeader}>Email notifications</Text>
      <View style={styles.section}>
        <CheckBoxInput label="Order statuses" />
        <CheckBoxInput label="Password changes" />
        <CheckBoxInput label="Special offers" />
        <CheckBoxInput label="Newsletter" />
      </View>
      <Button>Log out</Button>
      <View style={styles.buttonsContainer}>
        <Button type="outline" onPress={loadData}>
          Discard changes
        </Button>
        <Button type="alternate" onPress={saveChanges}>
          Save changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  inputLabel: {
    ...TYPOGRAPHY.lead,
    fontSize: 16,
    color: "#6f6f6f",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  section: {
    gap: 16,
    marginVertical: 16,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 16,
  },
  avatarButtonsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  avatarSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
