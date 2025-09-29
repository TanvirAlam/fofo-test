import styled, { css } from "styled-components";
import { ButtonProps } from ".";
import { BUTTON_TYPE } from "@/utils/constants";

const outline = css`
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const solid = css`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[50]};
  border: none;
`;

const disabledBase = css`
  color: ${({ theme }) => theme.colors.neutral[500]};
  cursor: not-allowed;
`;

const outlineDisabled = css`
  ${disabledBase};
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.primary[200]};
`;

const solidDisabled = css`
  ${disabledBase};
  background: ${({ theme }) => theme.colors.neutral[200]};
  border: none;
`;

export const StyledButton = styled.button<ButtonProps>`
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  width: ${({ width }) => width || "100%"};

  ${({ variant = BUTTON_TYPE.PRIMARY, disabled }) =>
    disabled
      ? variant === BUTTON_TYPE.OUTLINE
        ? outlineDisabled
        : solidDisabled
      : variant === BUTTON_TYPE.OUTLINE
        ? outline
        : solid};
`;
