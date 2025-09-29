"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  ErrorDetails,
  ErrorSummary,
  ErrorStack,
  ResetButton,
} from "../styles/root/ErrorBoundary.styles";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  t: (key: string) => string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorTitle>{this.props.t("errorBoundary.title")}</ErrorTitle>
          <ErrorMessage>{this.props.t("errorBoundary.message")}</ErrorMessage>
          <ErrorDetails>
            <ErrorSummary>
              {this.props.t("errorBoundary.detailsSummary")}
            </ErrorSummary>
            <ErrorStack>
              {this.state.error?.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </ErrorStack>
          </ErrorDetails>
          <ResetButton onClick={this.handleReset}>
            {this.props.t("errorBoundary.resetButton")}
          </ResetButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryWithTranslation: React.FC<Props> = props => {
  const { t } = useTranslation();

  return <ErrorBoundary {...props} t={t} />;
};

export default ErrorBoundaryWithTranslation;
