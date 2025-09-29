"use client";
import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { DURATION_TIME } from "@/constants/common";
import SignUpPage from "./(auth)/signup/page";

export default function Home() {
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenSplash = localStorage.getItem("hasSeenSplash");
      if (!hasSeenSplash) {
        setShowSplash(true);
      }
    }
    setIsChecked(true);
  }, []);

  const handleLoadingComplete = () => {
    localStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  if (!isChecked) return null;

  return showSplash ? (
    <SplashScreen
      onLoadingComplete={handleLoadingComplete}
      duration={DURATION_TIME}
    />
  ) : (
    <SignUpPage />
  );
}
