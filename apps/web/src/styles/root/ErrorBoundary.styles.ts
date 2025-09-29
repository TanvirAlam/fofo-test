import styled from "styled-components";

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  color: ${({ theme }) => theme.colors.neutral[950]};
`;

export const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.Heading2.fontSize};
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

export const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.Heading6.fontSize};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

export const ErrorDetails = styled.details`
  margin: 2rem 0;
  width: 100%;
  max-width: 600px;
  text-align: left;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 8px;
  padding: 1rem;

  &[open] {
    summary {
      margin-bottom: 1rem;
    }
  }
`;

export const ErrorSummary = styled.summary`
  cursor: pointer;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[800]};
  &:hover {
    color: ${({ theme }) => theme.colors.neutral[950]};
  }
`;

export const ErrorStack = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: ${({ theme }) => theme.colors.neutral[200]};
  padding: 1rem;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.typography.Body_Title1.fontFamily};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.neutral[800]};
  overflow-x: auto;
`;

export const ResetButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.neutral[800]};
  color: ${({ theme }) => theme.colors.neutral[50]};
  border: none;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[700]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.neutral[600]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.neutral[600]};
    outline-offset: 2px;
  }
`;
