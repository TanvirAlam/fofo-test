"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import InputField from "@/components/ui/InputFields";
import { INPUT_TYPE } from "@/utils/constants";
import {
  PhoneInputContainer,
  PhoneInputLabel,
  PhoneInputWrapper,
  CountryCode,
  PhoneInputField,
  ErrorMessage,
  SuccessMessage,
  SubmitButton,
} from "@/styles/SignUp/form.styles";

import { DENMARKCODE } from "@/utils/common";
import { useStaffRegistration } from "@/utils/register/staff/useStaffRegister";

export default function StaffForm() {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    onSubmit,
  } = useStaffRegistration();

  if (isSubmitSuccessful) {
    return (
      <SuccessMessage>
        <h3>{t("staffRegistrationSuccessTitle")}</h3>
        <p>{t("staffRegistrationSuccessMessage")}</p>
        <p>{t("staffRegistrationReviewMessage")}</p>
      </SuccessMessage>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <InputField
            label={t("fullName")}
            type={INPUT_TYPE.TEXT}
            value={field.value}
            placeholder={t("enterName")}
            onChange={field.onChange}
          />
        )}
      />
      {errors.fullName && (
        <ErrorMessage>{errors.fullName.message}</ErrorMessage>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <InputField
            label={t("email")}
            type={INPUT_TYPE.TEXT}
            value={field.value}
            placeholder={t("enterEmail")}
            onChange={field.onChange}
          />
        )}
      />
      {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

      <Controller
        name="phoneNumber"
        control={control}
        render={({ field }) => (
          <PhoneInputContainer>
            <PhoneInputLabel>{t("phoneNumber")}</PhoneInputLabel>
            <PhoneInputWrapper>
              <CountryCode>{DENMARKCODE}</CountryCode>
              <PhoneInputField
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder={t("enterPhoneNumber")}
                $hasError={!!errors.phoneNumber}
                value={field.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value)
                }
                onBlur={field.onBlur}
              />
            </PhoneInputWrapper>
            {errors.phoneNumber && (
              <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>
            )}
          </PhoneInputContainer>
        )}
      />

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("signUp")}
      </SubmitButton>
    </form>
  );
}
