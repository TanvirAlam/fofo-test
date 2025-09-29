import styled from "styled-components";

export const PhoneInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`;

export const PhoneInputLabel = styled.label`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: ${({ theme }) => theme.typography.Heading7.fontSize};
  font-weight: 500;
  text-align: left;
  padding-left: 1rem;
`;

export const PhoneInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const CountryCode = styled.span`
  position: absolute;
  left: 1rem;
  font-size: ${({ theme }) => theme.typography.Heading7.fontSize};
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-weight: 500;
  z-index: 10;
`;

export const PhoneInputField = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 3.75rem;
  font-size: ${({ theme }) => theme.typography.Heading7.fontSize};
  height: 3rem;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error[500] : theme.colors.neutral[400]};
  border-radius: 1.5rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[300]};
  }

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error[500] : theme.colors.primary[500]};
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.typography.Body_Title8};
  margin-top: 0.25rem;
  display: block;
  padding-left: 1rem;
`;

export const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success[100]}40;
  border: 1px solid ${({ theme }) => theme.colors.success[500]};
  color: ${({ theme }) => theme.colors.success[500]};
  padding: 1rem;
  border-radius: 1.5rem;
  text-align: center;
  margin: 1rem 0;
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  background: ${({ disabled, theme }) =>
    disabled ? theme.colors.neutral[300] : theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  font-size: ${({ theme }) => theme.typography.Heading7.fontSize};
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: ${({ disabled, theme }) =>
      disabled ? theme.colors.neutral[300] : theme.colors.primary[600]};
  }
`;
