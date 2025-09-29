import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Foodime",
    default: "Foodime - Food Delivery & Restaurant Discovery",
  },
  description:
    "Discover amazing restaurants and get food delivered fast with Foodime. Your favorite meals, just a click away.",
  keywords: ["food delivery", "restaurant", "takeaway", "dining"],
  authors: [{ name: "Foodime Team" }],
  creator: "Foodime",
  publisher: "Foodime",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["da_DK"],
    url: "https://foodime.com",
    title: "Foodime - Food Delivery & Restaurant Discovery",
    description:
      "Discover amazing restaurants and get food delivered fast with Foodime.",
    siteName: "Foodime",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Foodime - Food Delivery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foodime - Food Delivery & Restaurant Discovery",
    description:
      "Discover amazing restaurants and get food delivered fast with Foodime.",
    images: ["/og-image.jpg"],
    creator: "@foodime",
  },
  verification: {
    google: "your-google-site-verification-code",
  },
  alternates: {
    canonical: "https://foodime.com",
    languages: {
      "en-US": "https://foodime.com/en",
      "da-DK": "https://foodime.com/da",
    },
  },
  category: "food",
};
