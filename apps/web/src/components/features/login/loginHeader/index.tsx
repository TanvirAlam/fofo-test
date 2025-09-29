import React from "react";
import { BodyParagraph, Container, Title } from "./style";
import { useTranslation } from "react-i18next";

const LoginHeader = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Title>{t("login.title")}</Title>
      <BodyParagraph>{t("login.subtitle")}</BodyParagraph>
    </Container>
  );
};

export default LoginHeader;
