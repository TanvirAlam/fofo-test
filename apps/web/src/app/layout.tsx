import { Geist, Geist_Mono } from "next/font/google";
import { ClientProviders } from "../providers/ClientProviders";
import { metadata as layoutMetadata } from "../utils/metadata/layoutMetadata";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import StyledComponentsRegistry from "./registry";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = layoutMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <ClientProviders>
            <ErrorBoundary>
              {children}
              <SpeedInsights />
              <Analytics />
            </ErrorBoundary>
          </ClientProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
