import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { FormProvider } from "react-hook-form";
import { FormField } from "../../components/form/FormField";
import { PasswordStrength } from "../../components/form/PasswordStrength";
import { formatPhone, getPhonePlaceholder } from "../../utils/helpers";
import { COLORS } from "../../utils/colors";
import type { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../../utils/validation";
import { registerStyle } from "../../screens/auth/styles";

type Props = {
  form: UseFormReturn<RegisterFormValues>;
  loading: boolean;
  onSubmit: (data: RegisterFormValues) => void;
  onGoToLogin: () => void;
};

export const RegisterForm: React.FC<Props> = ({
  form,
  loading,
  onSubmit,
  onGoToLogin,
}) => {
  const { handleSubmit, watch, control } = form;
  const password = watch("password");
  const { t } = useTranslation();

  return (
    <FormProvider {...form}>
      <ScrollView
        contentContainerStyle={registerStyle.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Text style={registerStyle.title}>{t("register.title")}</Text>

        <FormField
          control={control}
          name="fullName"
          placeholder={t("register.fullName")}
          autoComplete="name"
          returnKeyType="next"
        />

        <FormField
          control={control}
          name="email"
          placeholder={t("register.email")}
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="next"
        />

        <FormField
          control={control}
          name="phone"
          placeholder={getPhonePlaceholder()}
          keyboardType="numeric"
          autoComplete="tel"
          maxLength={9}
          onValueChange={(value, onChange) => onChange(formatPhone(value))}
          returnKeyType="next"
        />

        <FormField
          control={control}
          name="password"
          placeholder={t("register.password")}
          secureTextEntry
          autoComplete="password"
          returnKeyType="next"
        />
        <PasswordStrength password={password} />

        <FormField
          control={control}
          name="confirmPassword"
          placeholder={t("register.confirmPassword")}
          secureTextEntry
          autoComplete="password"
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[registerStyle.button, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textWhite} size="small" />
          ) : (
            <Text style={registerStyle.buttonText}>
              {t("register.createAccount")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin}>
          <Text style={registerStyle.link}>
            {t("register.alreadyHaveAccount")} {t("register.login")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </FormProvider>
  );
};
