import styled from "styled-components";
import { GlobalStyle } from "@packages/ui";

const Container = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  align-items: center;
  justify-items: center;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 5rem;
  gap: 4rem;
  background-color: ${({ theme }) => theme.colors.neutral[950]};
  color: ${({ theme }) => theme.colors.neutral[50]};
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 32px;
  grid-row-start: 2;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral[600]};
  border-radius: 12px;
  padding: 2.5rem;
  background: linear-gradient(
    145deg,
    ${({ theme }) => theme.colors.neutral[800]},
    ${({ theme }) => theme.colors.neutral[900]}
  );
  box-shadow: 0 10px 30px ${({ theme }) => (theme.colors.neutral[950], 0.2)};
  width: 100%;
  max-width: 800px;
`;

const List = styled.ol`
  list-style: decimal inside;
  font-size: 1rem;
  line-height: 1.8rem;
  text-align: left;
  color: ${({ theme }) => theme.colors.neutral[200]};
  background: ${({ theme }) => theme.colors.neutral[800]};
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;

  li {
    margin-bottom: 1rem;
    padding-left: 1rem;
    border-left: 3px solid ${({ theme }) => theme.colors.info[500]};
    transition: all 0.3s ease;

    &:hover {
      border-left-color: ${({ theme }) => theme.colors.primary[400]};
      padding-left: 1.5rem;
      color: ${({ theme }) => theme.colors.neutral[50]};
    }
  }
`;

const Code = styled.code`
  background: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.info[200]};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-family: "Courier New", monospace;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
  width: 100%;
`;

const PrimaryButton = styled.a`
  border-radius: 50px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[300]},
    ${({ theme }) => theme.colors.primary[400]}
  );
  color: ${({ theme }) => theme.colors.neutral[950]};
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  height: 3rem;
  padding: 0 2rem;
  box-shadow: 0 4px 15px ${({ theme }) => theme.colors.primary[300]};
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme.colors.primary[300]};
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary[200]},
      ${({ theme }) => theme.colors.primary[300]}
    );
  }
`;

const SecondaryButton = styled.a`
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[600]};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.neutral[50]};
  font-weight: 500;
  font-size: 1rem;
  height: 3rem;
  padding: 0 2rem;
  background: transparent;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[700]};
    border-color: ${({ theme }) => theme.colors.primary[400]};
    transform: translateY(-2px);
  }
`;

const Footer = styled.footer`
  grid-row-start: 3;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[700]};
  padding-top: 2rem;
  width: 100%;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.neutral[200]};
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[400]};
      transform: translateY(-2px);
    }
  }
`;

export {
  Container,
  Main,
  List,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  Footer,
  Code,
  GlobalStyle,
};
