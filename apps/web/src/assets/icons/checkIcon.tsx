import { COLORS } from "@packages/ui";
import React from "react";

type IconProps = {
  width?: number | string;
  height?: number | string;
  outerColor?: string;
  innerColor?: string;
  checkColor?: string;
};

export const CheckIcon: React.FC<IconProps> = ({
  width = 77,
  height = 76,
  outerColor = COLORS.success[100],
  innerColor = COLORS.success[600],
  checkColor = COLORS.primary[50],
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 77 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" width="76" height="76" rx="38" fill={outerColor} />
      <rect x="10.5" y="10" width="56" height="56" rx="28" fill={innerColor} />
      <path
        d="M34.5004 45.6669C34.499 45.6669 34.4977 45.6669 34.4964 45.6669C34.2297 45.6655 33.975 45.5589 33.787 45.3682L28.4537 39.9522C28.0657 39.5588 28.071 38.9255 28.4644 38.5375C28.8577 38.1509 29.4924 38.1549 29.879 38.5482L34.5044 43.2469L47.1257 30.6255C47.5164 30.2349 48.1497 30.2349 48.5404 30.6255C48.931 31.0162 48.931 31.6496 48.5404 32.0402L35.207 45.3736C35.0204 45.5616 34.7657 45.6669 34.5004 45.6669Z"
        fill={checkColor}
      />
    </svg>
  );
};
