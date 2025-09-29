export const BUTTON_TYPE = {
  PRIMARY: "primary",
  OUTLINE: "outline",
} as const;

export type ButtonType = (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE];

export const INPUT_TYPE = {
  TEXT: "text",
  NUMBER: "number",
} as const;

export type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

export const onlyDigits = (s: string) => s.replace(/\D/g, "");
export const ROLE = {
  manager: "manager",
  staff: "staff",
} as const;

export const REQUIRED_MESSAGE = "CVR number is required";
export const LENGTH_MESSAGE = "CVR must be exactly 8 digits";
export const INVALID_MESSAGE = "Invalid CVR number";
export const CVR_REGEX = /^[0-9]{8}$/;
export const WEIGHTS = [2, 7, 6, 5, 4, 3, 2, 1];
