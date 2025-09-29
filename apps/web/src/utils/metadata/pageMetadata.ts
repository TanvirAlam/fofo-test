import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Foodime - discover amazing restaurants and get your favorite food delivered.",
  openGraph: {
    title: "Foodime - Food Delivery & Restaurant Discovery",
    description:
      "Welcome to Foodime - discover amazing restaurants and get your favorite food delivered.",
    url: "https://foodime.com",
    images: ["/home-og-image.jpg"],
  },
  alternates: {
    canonical: "https://foodime.com",
  },
};
