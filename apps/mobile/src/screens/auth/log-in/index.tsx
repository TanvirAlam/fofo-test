import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginForm } from "../../../components/LoginForm";
import { useLoginForm } from "../../../hooks/useLoginForm";
import { styles } from "../../../components/LoginForm/style";
import { LoginFormValues } from "../../../utils/validation";
import { RootStackParamList } from "../../../navigation/AppNavigator";

export const LoginScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useLoginForm();

  const onSubmit = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data: LoginFormValues
  ): Promise<void> => {
    setLoading(true);
    try {
      navigation.navigate("Dashboard");
    } catch {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = (): void => navigation.navigate("Register");
  const goToForgotPassword = (): void => navigation.navigate("ForgotPassword");

  return (
    <SafeAreaView style={styles.container}>
      <LoginForm
        form={form}
        loading={loading}
        onSubmit={onSubmit}
        onGoToRegister={goToRegister}
        onForgotPassword={goToForgotPassword}
      />
    </SafeAreaView>
  );
};
