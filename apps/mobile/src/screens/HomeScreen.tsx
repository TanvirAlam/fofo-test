import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { COLORS, typography } from "../theme";
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const handlePress = () => {
    Alert.alert("Success!", "Your Foodime mobile app is working perfectly! 🎉");
  };

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "da" : "en";
    i18n.changeLanguage(nextLang);
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={[typography.Heading1, styles.title]}>
            Welcome to Foodime!
          </Text>
          <Text style={[typography.Heading4, styles.subtitle]}>
            Your mobile app is ready
          </Text>
          <Text style={[typography.Body_Large, styles.description]}>
            This is your React Native app with Expo, integrated into the Foodime
            monorepo.
          </Text>

          <View style={styles.features}>
            <Text style={[typography.Heading4, styles.featuresTitle]}>
              Features included:
            </Text>
            <Text style={[typography.Body_Large, styles.feature]}>
              • React Navigation
            </Text>
            <Text style={[typography.Body_Large, styles.feature]}>
              • Safe Area handling
            </Text>
            <Text style={[typography.Body_Large, styles.feature]}>
              • TypeScript support
            </Text>
            <Text style={[typography.Body_Large, styles.feature]}>
              • ESLint configuration
            </Text>
            <Text style={[typography.Body_Large, styles.feature]}>
              • Shared UI components
            </Text>
            <Text style={[typography.Body_Large, styles.feature]}>
              • Monorepo integration
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={[typography.Heading4, styles.buttonText]}>
              Test App 🚀
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register" as never)}
          >
            <Text style={[typography.Heading4, styles.buttonText]}>
              {t("goToRegister")}
            </Text>
          </TouchableOpacity>

          <View style={styles.text}>
            <Button
              title={t("changeLanguage") || "Change Language"}
              onPress={toggleLanguage}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY.WHITE,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    color: COLORS.SECONDARY.DARK_GRAY,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.PRIMARY.GRAY,
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    color: COLORS.SECONDARY.MEDIUM_GRAY,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  features: {
    alignSelf: "stretch",
    backgroundColor: COLORS.SECONDARY.LIGHT_GRAY,
    padding: 20,
    borderRadius: 10,
  },
  featuresTitle: {
    color: COLORS.SECONDARY.DARK_GRAY,
    marginBottom: 15,
  },
  feature: {
    color: COLORS.SECONDARY.MEDIUM_GRAY,
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.PRIMARY.BLUE,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: COLORS.PRIMARY.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.PRIMARY.WHITE,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    margin: 30,
    textAlign: "center",
  },
});
