import React from "react";
import { useTranslation } from "react-i18next";

export default function Button() {
  const { t } = useTranslation();
  return <button>{t("clickMe")}</button>;
}
