import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";
import { TYPOGRAPHY } from "../theme/typography";

const labels = {
  primary: "labelPrimary",
  alternate: "labelAlternate",
  outline: "labelOutline",
};

export default function Button(props) {
  const { children, disabled, type = "primary", ...otherProps } = props;
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabled : styles[type]]}
      disabled={disabled}
      {...otherProps}
    >
      <Text style={[styles.label, styles[labels[type]]]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
  label: {
    textAlign: "center",
    ...TYPOGRAPHY.button,
  },
  disabled: {
    backgroundColor: COLORS.light,
  },
  primary: {
    backgroundColor: COLORS.brand,
  },
  labelPrimary: {
    color: "black",
  },
  alternate: {
    backgroundColor: COLORS.accent,
  },
  labelAlternate: {
    color: "white",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  labelOutline: {
    color: COLORS.accent,
  },
});
