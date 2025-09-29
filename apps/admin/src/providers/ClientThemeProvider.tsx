"use client";
import { ThemeProvider } from "@packages/ui";
import { GlobalStyle } from "../styles/root/root.style";

export function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

export default ClientThemeProvider;
