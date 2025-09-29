import { COLORS } from "@packages/ui";
import React from "react";

type ChevronIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
};

export const ChevronIcon: React.FC<ChevronIconProps> = ({
  width = 20,
  height = 20,
  color = COLORS.primary.BLACK,
  strokeWidth = 1.5,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
