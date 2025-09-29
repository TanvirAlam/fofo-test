"use client";
import React, { useState } from "react";
import {
  FormWrapper,
  FormTitle,
  FormContent,
  LoginLink,
  LoginText,
  FormFields,
} from "@/styles/SignUp/formWrapper.style";
import ManagerForm from "./ManagerForm";
import StaffForm from "./StaffForm";
import TabContainer from "./TabContainer";
import { useTranslation } from "react-i18next";
import { ROLE } from "@/utils/constants";
import ErrorBoundary from "@/components/ErrorBoundary";

type UserType = "manager" | "staff";

export default function SignUpForm() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<UserType>("manager");

  return (
    <FormWrapper>
      <FormTitle>{t("signUp")}</FormTitle>

      <TabContainer activeTab={activeTab} onTabChange={setActiveTab} />

      <FormContent>
        <FormFields>
          {activeTab === ROLE.manager && (
            <ErrorBoundary>
              <ManagerForm />
            </ErrorBoundary>
          )}
          {activeTab === ROLE.staff && <StaffForm />}
        </FormFields>
        <LoginText>
          {t("login.loginText")}
          <LoginLink href="/login">{t("login.title")}</LoginLink>
        </LoginText>
      </FormContent>
    </FormWrapper>
  );
}
