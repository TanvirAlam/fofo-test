import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, Text, View } from "react-native";
import { FormProvider, Controller } from "react-hook-form";
import { FormField } from "../form/FormField";
import type { UseFormReturn } from "react-hook-form";
import { COLORS, typography } from "../../theme";
import { styles } from "./style";
import { LoginFormValues } from "../../utils/validation";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type LoginProps = {
  form: UseFormReturn<LoginFormValues>;
  loading: boolean;
  onSubmit: (data: LoginFormValues) => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
};

export const LoginForm: React.FC<LoginProps> = ({
  form,
  loading,
  onSubmit,
  onGoToRegister,
  onForgotPassword,
}) => {
  const { handleSubmit, control } = form;
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  return (
    <FormProvider {...form}>
      <View style={styles.content}>
        <Text style={[typography.Heading1, styles.title]}>
          {t("loginTitle")}
        </Text>

        <FormField
          control={control}
          name="identifier"
          placeholder="Email or Phone"
          keyboardType="default"
          autoComplete="email"
          returnKeyType="next"
        />

        <View style={styles.passwordContainer}>
          <FormField
            key={showPassword ? "show" : "hide"}
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoComplete="password"
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword((s) => !s)}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color={COLORS.PRIMARY.GRAY}
            />
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => field.onChange(!field.value)}
            >
              <MaterialIcons
                name={field.value ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={COLORS.PRIMARY.BLUE}
              />
              <Text
                style={[
                  typography.Body_Medium_Semi_Bold,
                  styles.rememberMeText,
                ]}
              >
                {t("rememberMe")}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity onPress={onForgotPassword}>
          <Text style={[typography.Body_Medium, styles.link]}>
            {t("forgotPassword")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.PRIMARY.ORANGE} size="small" />
          ) : (
            <Text style={typography.Button_Text}>{t("loginButton")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister}>
          <Text style={[typography.Body_Large, styles.link]}>
            {t("noAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </FormProvider>
  );
};
