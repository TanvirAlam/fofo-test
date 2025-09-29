import React from "react";
import {
  Container,
  Label,
  StyledInput,
  IconWrapper,
  InputWrapper,
} from "./styles";
import { INPUT_TYPE, InputType } from "@/utils/constants";
import { Container, Label, StyledInput } from "./styles";

export type InputFieldProps = {
  label: string;
  type?: InputType;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  tabIndex?: number;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  onIconClick?: () => void;
};

export default function InputField({
  label,
  type = INPUT_TYPE.TEXT,
  value,
  placeholder,
  disabled = false,
  width,
  onChange,
  icon,
  onIconClick,
}: InputFieldProps) {
  return (
    <Container width={width}>
      <Label>{label}</Label>
      <InputWrapper>
        <StyledInput
          type={type}
          value={value}
          placeholder={placeholder || label}
          disabled={disabled}
          onChange={e => onChange && onChange(e.target.value)}
        />
        {icon && <IconWrapper onClick={onIconClick}>{icon}</IconWrapper>}
      </InputWrapper>
    </Container>
  );
}
