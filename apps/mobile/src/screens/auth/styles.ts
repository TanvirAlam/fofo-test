import { StyleSheet } from "react-native";
import { COLORS } from "../../utils/colors";

const spacing = 20;

export const registerStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    alignItems: "stretch",
    paddingHorizontal: 48,
  },
  content: {
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: spacing,
    textAlign: "center",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: spacing / 2,
    fontSize: 16,
    backgroundColor: COLORS.background,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginVertical: spacing / 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: spacing,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  link: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: spacing / 2,
    marginBottom: 0,
    fontSize: 16,
    fontWeight: "500",
  },
  passwordStrength: {
    fontSize: 14,
    marginVertical: spacing / 2,
    marginLeft: 4,
    fontWeight: "500",
  },
});
