import { StyleSheet } from "react-native";
import { COLORS } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY.WHITE,
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
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.PRIMARY.BLACK,
    lineHeight: 34,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.SECONDARY.LIGHT,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.PRIMARY.WHITE,
    shadowColor: COLORS.SECONDARY.LIGHT_GRAY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  error: {
    color: COLORS.PRIMARY.RED,
    marginVertical: 5,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    backgroundColor: COLORS.PRIMARY.BLUE,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: COLORS.PRIMARY.BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  link: {
    color: COLORS.PRIMARY.BLUE,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 0,
    fontWeight: "500",
  },
  passwordStrength: {
    marginVertical: 10,
    marginLeft: 4,
    fontWeight: "500",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: 15,
    top: 25,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rememberMeText: {
    marginLeft: 8,
    color: COLORS.PRIMARY.BLACK,
  },
});
