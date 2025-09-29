import { COLORS } from "@packages/ui";
import React from "react";

type IconProps = {
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  crossColor?: string;
};

export const CrossIcon: React.FC<IconProps> = ({
  width = 32,
  height = 32,
  backgroundColor = COLORS.primary[100],
  crossColor = COLORS.primary[500],
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill={backgroundColor} />
      <path
        d="M22.5297 21.4698C22.8227 21.7628 22.8227 22.2378 22.5297 22.5308C22.3837 22.6768 22.1917 22.7508 21.9997 22.7508C21.8077 22.7508 21.6158 22.6778 21.4698 22.5308L15.9997 17.0608L10.5297 22.5308C10.3837 22.6768 10.1917 22.7508 9.99975 22.7508C9.80775 22.7508 9.61575 22.6778 9.46975 22.5308C9.17675 22.2378 9.17675 21.7628 9.46975 21.4698L14.9398 15.9998L9.46975 10.5298C9.17675 10.2368 9.17675 9.76177 9.46975 9.46877C9.76275 9.17577 10.2378 9.17577 10.5308 9.46877L16.0008 14.9388L21.4707 9.46877C21.7637 9.17577 22.2387 9.17577 22.5317 9.46877C22.8247 9.76177 22.8247 10.2368 22.5317 10.5298L17.0617 15.9998L22.5297 21.4698Z"
        fill={crossColor}
      />
    </svg>
  );
};
