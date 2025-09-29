import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { HomeScreen } from "../screens/HomeScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { LoginScreen } from "../screens/auth/log-in";
import DashboardScreen from "../screens/main/dashboard";
import ForgotPasswordScreen from "../screens/auth/forgot-password";

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
  Dashboard: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Foodime" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: t("dashboard") }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: t("forgotPassword") }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: t("register.title") }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: t("register.login") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
