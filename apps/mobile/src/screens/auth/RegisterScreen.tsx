import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerStyle } from "./styles";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { RegisterFormValues } from "../../utils/validation";
import { RegisterForm } from "../../components/form/RegisterForm";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { timeOutDelay } from "../../utils/helpers";

export const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const form = useRegisterForm();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      // TODO: Replace with real API call
      console.log("Registration data:", data);

      await new Promise(r => setTimeout(r, timeOutDelay));

      alert("Registration Successful");
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={registerStyle.container}>
      <RegisterForm
        form={form}
        loading={loading}
        onSubmit={onSubmit}
        onGoToLogin={() => navigation.navigate("Login")}
      />
    </SafeAreaView>
  );
};
