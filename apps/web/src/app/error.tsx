"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  ErrorDetails,
  ErrorSummary,
  ErrorStack,
  ResetButton,
} from "@/styles/root/ErrorBoundary.styles";
import { DEVELOPMENT } from "@/constants/common";

interface Props {
  error: Error;
  reset: () => void;
}

const GlobalErrorBoundary: React.FC<Props> = ({ error, reset }) => {
  const { t } = useTranslation();
  const showDetails = DEVELOPMENT;

  return (
    <ErrorContainer>
      <ErrorTitle>{t("errorBoundary.globalTitle")}</ErrorTitle>
      <ErrorMessage>{t("errorBoundary.globalMessage")}</ErrorMessage>
      {showDetails && (
        <ErrorDetails>
          <ErrorSummary>{t("errorBoundary.detailsSummary")}</ErrorSummary>
          <ErrorStack>
            {error.toString()}
            <br />
          </ErrorStack>
        </ErrorDetails>
      )}
      <ResetButton onClick={reset}>
        {t("errorBoundary.resetButton")}
      </ResetButton>
    </ErrorContainer>
  );
};

export default GlobalErrorBoundary;
