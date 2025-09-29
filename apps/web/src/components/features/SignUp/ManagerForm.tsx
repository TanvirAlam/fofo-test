"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { useManagerForm } from "@/utils/register/manager/useRegister";

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
import { useTranslation } from "react-i18next";

export default function ManagerForm() {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    onSubmit,
  } = useManagerForm();

  if (isSubmitSuccessful) {
    return (
      <SuccessMessage>
        <h3>{t("managerRegistrationSuccessTitle")}</h3>
        <p>{t("managerRegistrationSuccessMessage")}</p>
        <p>{t("managerRegistrationReviewMessage")}</p>
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
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            </PhoneInputWrapper>
            {errors.phoneNumber && (
              <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>
            )}
          </PhoneInputContainer>
        )}
      />

      <Controller
        name="restaurantName"
        control={control}
        render={({ field }) => (
          <InputField
            label={t("restaurantName")}
            type={INPUT_TYPE.TEXT}
            value={field.value}
            placeholder={t("enterRestaurantName")}
            onChange={field.onChange}
          />
        )}
      />
      {errors.restaurantName && (
        <ErrorMessage>{errors.restaurantName.message}</ErrorMessage>
      )}

      <Controller
        name="restaurantAddress"
        control={control}
        render={({ field }) => (
          <InputField
            label={t("restaurantAddress")}
            type={INPUT_TYPE.TEXT}
            value={field.value}
            placeholder={t("enterRestaurantAddress")}
            onChange={field.onChange}
          />
        )}
      />
      {errors.restaurantAddress && (
        <ErrorMessage>{errors.restaurantAddress.message}</ErrorMessage>
      )}

      <Controller
        name="cvrNumber"
        control={control}
        render={({ field }) => (
          <InputField
            label={t("cvrNumber")}
            type={INPUT_TYPE.TEXT}
            value={field.value}
            placeholder={t("enterCvrNumber")}
            onChange={field.onChange}
          />
        )}
      />
      {errors.cvrNumber && (
        <ErrorMessage>{errors.cvrNumber.message}</ErrorMessage>
      )}

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("signUp")}
      </SubmitButton>
    </form>
  );
}
