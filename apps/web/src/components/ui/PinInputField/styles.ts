import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
`;

export const Label = styled.label<{ $align?: "left" | "center" | "right" }>`
  margin-top: 3rem;
  margin-bottom: 0.5rem;
  ${({ theme }) => theme.typography.Heading7}
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: block;
  width: 100%;
  text-align: ${({ $align }) => $align || "left"};
`;
export const Row = styled.div<{ $gap: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
`;

export const PinBox = styled.input<{ $filled: boolean }>`
  width: 5rem;
  height: 5rem;

  display: inline-block;

  padding: 0.625rem;
  box-sizing: border-box;

  border: 1px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 2rem;
  background: ${({ theme }) => theme.colors.primary[50]};

  text-align: center;
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 500;

  color: ${({ theme }) => theme.colors.primary.BLACK};
  caret-color: ${({ theme }) => theme.colors.primary[500]};

  font-variant-numeric: tabular-nums;

  outline: none;

  -moz-appearance: textfield;
  appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $filled }) =>
    $filled &&
    css`
      ${({ theme }) => theme.typography.Heading4};
      box-sizing: border-box;
      border: 1px solid ${({ theme }) => theme.colors.primary[400]};
      border-radius: 2rem;
      color: ${({ theme }) => theme.colors.neutral[800]};
      background: ${({ theme }) => theme.colors.primary[100]};
    `}
`;
