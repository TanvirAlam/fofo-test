import React from "react";
import { Text } from "react-native";
import { getPasswordStrength } from "../../utils/helpers";
import { COLORS } from "../../utils/colors";
import { registerStyle } from "../../screens/auth/styles";

type Props = { password?: string };

export const PasswordStrength: React.FC<Props> = ({ password }) => {
  if (!password) return null;
  const strength = getPasswordStrength(password);
  const color = ["Very Weak", "Weak"].includes(strength)
    ? COLORS.weak
    : strength === "Fair"
      ? COLORS.fair
      : COLORS.strong;

  return (
    <Text style={[registerStyle.passwordStrength, { color }]}>
      Your password is {strength}
    </Text>
  );
};
