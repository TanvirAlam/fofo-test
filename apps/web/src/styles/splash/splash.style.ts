import styled, { keyframes } from "styled-components";

const drawPath = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const spin = keyframes`
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

export const SplashContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.primary[600]};
  font-family: ${({ theme }) => theme.typography.Caption_Large.fontFamily};
  font-size: ${({ theme }) => theme.typography.Caption_Large.fontSize};
`;

export const BackgroundSVGContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  z-index: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SVGPath = styled.path`
  stroke: ${({ theme }) => theme.colors.primary[300]};
  stroke-width: 30;
  stroke-linecap: round;
  stroke-dasharray: 4000;
  stroke-dashoffset: 4000;
  animation: ${drawPath} 5s ease-out forwards;
  opacity: 0.3;

  &.accent-path-1 {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation-delay: 1s;
    stroke: ${({ theme }) => theme.colors.primary[200]};
  }

  &.accent-path-2 {
    stroke-dasharray: 150;
    stroke-dashoffset: 150;
    animation-delay: 2s;
    stroke: ${({ theme }) => theme.colors.primary[100]};
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;
  text-align: center;
  padding: 1rem;
  animation: ${fadeIn} 1s ease-out 0.5s both;
`;

export const Title = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  font-style: italic;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  letter-spacing: 2px;
  text-shadow: 0 4px 8px ${({ theme }) => theme.colors.primary.BLACK_50};
  animation: ${pulse} 3s ease-in-out infinite;

  @media (max-width: 48rem) {
    font-size: ${({ theme }) => theme.typography.Heading3};
    letter-spacing: 1px;
  }

  @media (max-width: 30rem) {
    font-size: ${({ theme }) => theme.typography.Heading4};
  }
`;

export const Divider = styled.div`
  height: 1px;
  width: 50%;
  background-color: ${({ theme }) => theme.colors.neutral[400]};
  margin: 0.5rem 0;
  opacity: 0.8;

  @media (max-width: 48rem) {
    width: 70%;
  }
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.Heading6};
  margin: 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[200]};

  strong {
    color: ${({ theme }) => theme.colors.success[200]};
    font-weight: 600;
  }

  @media (max-width: 48rem) {
    font-size: ${({ theme }) => theme.typography.Heading6};
  }

  @media (max-width: 30rem) {
    font-size: ${({ theme }) => theme.typography.Heading7};
  }
`;

export const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.Heading7};
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.neutral[200]};
  font-weight: 400;

  @media (max-width: 30rem) {
    font-size: 0.875rem;
  }
`;

export const Spinner = styled.div`
  border: 0.25rem solid ${({ theme }) => theme.colors.neutral[300]};
  border-top: 0.25rem solid ${({ theme }) => theme.colors.success[500]};
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  animation: ${spin} 1.5s linear infinite;
  margin-top: 0.5rem;

  @media (max-width: 30rem) {
    width: 2rem;
    height: 2rem;
    border-width: 0.1875rem;
  }
`;

export const animations = {
  drawPath,
  spin,
  fadeIn,
  pulse,
};
