"use client";

import { ThemeProvider } from "@packages/ui";
import { GlobalStyle } from "./../styles/root/root.style";
import { I18nextProvider } from "react-i18next";
import i18n from "./../utils/i18n";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeProvider>
  );
}
