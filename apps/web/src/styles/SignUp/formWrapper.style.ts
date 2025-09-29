import styled from "styled-components";

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 4rem 1rem 0rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;

  @media (max-width: 48rem) {
    max-width: 100%;
    padding: 1.5rem;
    gap: 1.25rem;
  }

  @media (max-width: 30rem) {
    padding: 1rem;
    gap: 1rem;
  }
`;

export const FormTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.Heading3};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 0;
  text-align: left;

  @media (max-width: 48rem) {
    font-size: 1.5rem;
  }

  @media (max-width: 30rem) {
    font-size: 1.25rem;
  }
`;

export const TabContainer = styled.div`
  width: 100%;
  max-width: 28.25rem;
  height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  padding: 0.5rem 0.25rem 0.5rem 0.25rem;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 3.125rem;

  @media (max-width: 48rem) {
    width: 100%;
    gap: 0.5rem;
    padding: 0.5rem 0.125rem 0.5rem 0.125rem;
  }

  @media (max-width: 30rem) {
    height: 2.5rem;
    gap: 0.25rem;
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  width: 100%;
  max-width: 13.3125rem;
  height: 2.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.125rem;
  padding: 0 2rem;
  border: none;
  border-radius: 2.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[500] : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.WHITE : theme.colors.primary[500]};

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary[700] : theme.colors.primary[200]};
  }

  @media (max-width: 48rem) {
    max-width: 9.375rem;
    padding: 0 1rem;
    font-size: 0.875rem;
  }

  @media (max-width: 30rem) {
    max-width: 7.5rem;
    height: 2.25rem;
    padding: 0 0.75rem;
    font-size: 0.8125rem;
  }
`;

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 48rem) {
    gap: 1.25rem;
  }

  @media (max-width: 30rem) {
    gap: 1rem;
  }
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 48rem) {
    gap: 0.875rem;
  }

  @media (max-width: 30rem) {
    gap: 0.75rem;
  }
`;

export const LoginText = styled.p`
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin: 1rem 0 0 0;

  @media (max-width: 48rem) {
    font-size: 0.9375rem;
    margin: 0.875rem 0 0 0;
  }

  @media (max-width: 30rem) {
    font-size: 0.875rem;
    margin: 0.75rem 0 0 0;
  }
`;

export const LoginLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[500]};
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;
