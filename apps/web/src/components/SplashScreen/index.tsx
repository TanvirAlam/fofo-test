import React, { useEffect } from "react";
import {
  SplashContainer,
  ContentContainer,
  Title,
  Divider,
  Subtitle,
  LoadingText,
  Spinner,
} from "../../styles/splash/splash.style";

import { BackgroundSVG } from "../../components/ui/svg/backgroundSvg";

interface SplashScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onLoadingComplete,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, duration]);

  return (
    <SplashContainer>
      <BackgroundSVG />

      <ContentContainer>
        <Title>foodime</Title>

        <Divider />

        <Subtitle>
          Serve Smarter. <strong>Grow Faster.</strong>
        </Subtitle>

        <LoadingText>Loading your restaurant experience...</LoadingText>

        <Spinner />
      </ContentContainer>
    </SplashContainer>
  );
};

export default SplashScreen;
