"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import formImage from "@/assets/photos/manager-photo.png";
import LoginHeader from "../../../components/features/login/loginHeader";
import SelectEmployee from "../../../components/features/login/selectEmployee";
import {
  LoginContainer,
  MainContainer,
  LoginWrapper,
  LoginButton,
  ForgotPassword,
  SignUpLink,
  SignInText,
} from "../../../styles/login/login.style";
import {
  ImageContainer,
  StyledImage,
} from "../../../styles/SignUp/signup.style";
import { ButtonGroup } from "../../../styles/root/root.style";
import GenericButton from "../../../components/ui/Buttons";
import PinField from "../../../components/ui/PinInputField";
import { Label } from "../../../components/ui/PinInputField/styles";

const LoginScreen = () => {
  const [pin, setPin] = useState<string>("");
  const { t } = useTranslation();
  return (
    <MainContainer>
      <LoginContainer>
        <LoginWrapper>
          <LoginHeader />
          <SelectEmployee />
          <Label $align="center">{t("login.enterPin")}</Label>
          <PinField value={pin} onChange={setPin} />
          <LoginButton>
            <ButtonGroup>
              <GenericButton disabled>{t("login.loginButton")}</GenericButton>
            </ButtonGroup>
          </LoginButton>
          <ForgotPassword>{t("login.forgotPassword")}</ForgotPassword>
          <SignInText>
            {t("login.noAccount")}
            <SignUpLink href="/signup"> {t("login.signUp")}</SignUpLink>
          </SignInText>
        </LoginWrapper>
      </LoginContainer>

      <ImageContainer>
        <StyledImage>
          <Image src={formImage} alt={t("login.formImageAlt")} fill />
        </StyledImage>
      </ImageContainer>
    </MainContainer>
  );
};

export default LoginScreen;
