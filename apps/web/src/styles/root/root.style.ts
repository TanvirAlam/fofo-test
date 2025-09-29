import styled from "styled-components";
import Image from "next/image";
import { GlobalStyle } from "@packages/ui";
import { LogoIcon } from "../../assets/icons/logoIcon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary.WHITE};
  color: ${({ theme }) => theme.colors.neutral[50]};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.4;
  }

  ${({ theme }) => theme.media.md} {
    padding: 2rem;
  }

  ${({ theme }) => theme.media.lg} {
    padding: 3rem 4rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  z-index: 1;
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  ${({ theme }) => theme.media.md} {
    padding: 3rem 0;
    gap: 2rem;
  }
`;

const Logo = styled(Image)`
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  ${({ theme }) => theme.media.md} {
    margin-bottom: 2rem;
  }
`;

const StyledLogoIcon = styled(LogoIcon)`
  margin-top: auto;
  margin-bottom: 0;
  transition: transform 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
  }

  ${({ theme }) => theme.media.md} {
    margin-bottom: 0;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral[50]},
    ${({ theme }) => theme.colors.neutral[200]}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;

  ${({ theme }) => theme.media.md} {
    font-size: 3rem;
  }

  ${({ theme }) => theme.media.lg} {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.neutral[200]};
  margin-bottom: 3rem;
  max-width: 600px;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => `rgba(${theme.colors.neutral[900]}, 0.4)`};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[800]};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme }) => `rgba(${theme.colors.neutral[900]}, 0.4)`};
    border-color: ${({ theme }) => theme.colors.neutral[700]};
    box-shadow: 0 10px 20px
      ${({ theme }) => `rgba(${theme.colors.neutral[950]}, 0.2)`};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[50]};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.neutral[200]};
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  ${({ theme }) => theme.media.md} {
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  ${({ theme }) => theme.media.lg} {
    gap: 2rem;
    margin-bottom: 3rem;
  }
`;

const PrimaryButton = styled.a`
  border-radius: 50px;
  border: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral[700]},
    ${({ theme }) => theme.colors.neutral[600]}
  );
  color: ${({ theme }) => theme.colors.neutral[50]};
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  height: 3rem;
  padding: 0 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.neutral[600]},
      ${({ theme }) => theme.colors.neutral[500]}
    );
  }

  ${({ theme }) => theme.media.md} {
    font-size: 1rem;
    height: 3.25rem;
    padding: 0 2rem;
  }

  ${({ theme }) => theme.media.lg} {
    font-size: 1.1rem;
    height: 3.5rem;
    padding: 0 2.5rem;
  }
`;

const SecondaryButton = styled.a`
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[700]};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  height: 2.75rem;
  padding: 0 1.25rem;
  color: ${({ theme }) => theme.colors.neutral[50]};
  background: transparent;

  &:hover {
    background: ${({ theme }) => (theme.colors.neutral[900], 0.4)};
    border-color: ${({ theme }) => theme.colors.neutral[600]};
    transform: translateY(-2px);
  }

  ${({ theme }) => theme.media.md} {
    font-size: 0.95rem;
    height: 3rem;
    padding: 0 1.5rem;
  }

  ${({ theme }) => theme.media.lg} {
    font-size: 1rem;
    height: 3.25rem;
    padding: 0 2rem;
  }
`;

const LangButton = styled.button`
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[700]};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
  height: 2.5rem;
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.neutral[50]};
  background: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[800]};
    transform: translateY(-2px);
  }
`;

const Footer = styled.footer`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  z-index: 1;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[800]};
  margin-top: auto;
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.neutral[200]};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[50]};
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const Code = styled.code`
  background: ${({ theme }) => theme.colors.neutral[800]};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[50]};
`;

export {
  Container,
  Main,
  Logo,
  StyledLogoIcon,
  Title,
  Subtitle,
  FeatureGrid,
  FeatureCard,
  FeatureTitle,
  FeatureDescription,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  LangButton,
  Footer,
  FooterLink,
  Code,
  Image,
  GlobalStyle,
};
