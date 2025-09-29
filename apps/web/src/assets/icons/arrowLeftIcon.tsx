import { COLORS } from "@packages/ui";
import React from "react";

type ArrowLeftIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  width = 7,
  height = 13,
  color = COLORS.primary[500],
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 7 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.57258 1.22219C6.73955 1.38921 6.83334 1.6157 6.83334 1.85186C6.83334 2.08802 6.73955 2.31452 6.57258 2.48154L2.16398 6.89014L6.57258 11.2987C6.73481 11.4667 6.82459 11.6917 6.82256 11.9252C6.82053 12.1587 6.72686 12.3821 6.56173 12.5472C6.3966 12.7124 6.17322 12.806 5.9397 12.8081C5.70618 12.8101 5.48121 12.7203 5.31323 12.5581L0.27496 7.51981C0.107993 7.35279 0.0141959 7.1263 0.0141959 6.89014C0.0141959 6.65397 0.107993 6.42748 0.27496 6.26046L5.31323 1.22219C5.48025 1.05522 5.70674 0.961426 5.94291 0.961426C6.17907 0.961426 6.40556 1.05522 6.57258 1.22219Z"
        fill={color}
      />
    </svg>
  );
};
