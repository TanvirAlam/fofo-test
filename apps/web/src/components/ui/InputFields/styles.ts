import styled from "styled-components";

export const Container = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => width || "100%"};
  margin-bottom: 12px;
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  padding-left: 1rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input`
  padding: 0px 12px 0px 16px;
  font-size: 16px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral[400]};
  border-radius: 24px;
  outline: none;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[600]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
`;
