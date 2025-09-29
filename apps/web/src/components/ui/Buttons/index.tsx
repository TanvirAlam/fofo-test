import React from "react";
import { StyledButton } from "./styles";
import { BUTTON_TYPE, ButtonType } from "@/utils/constants";

export type ButtonProps = {
  variant?: ButtonType;
  disabled?: boolean;
  width?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function GenericButton({
  variant = BUTTON_TYPE.PRIMARY,
  disabled = false,
  width,
  children,
  onClick,
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      disabled={disabled}
      width={width}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}
