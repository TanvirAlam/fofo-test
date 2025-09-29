import styled from "styled-components";

export const ErrorContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[800]};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.error[500]};
  font-family: ${({ theme }) => theme.typography.Body_Title8};
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.Heading2};
  margin-bottom: 1rem;
`;

export const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.Body_Title8};
  margin-top: 0.5rem;
`;
