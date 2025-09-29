import { COLORS } from "@packages/ui";
import React from "react";

type ArrowRightIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({
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
        d="M0.42742 1.22219C0.260453 1.38921 0.166656 1.6157 0.166656 1.85186C0.166656 2.08802 0.260453 2.31452 0.42742 2.48154L4.83602 6.89014L0.42742 11.2987C0.265185 11.4667 0.175415 11.6917 0.177444 11.9252C0.179473 12.1587 0.27314 12.3821 0.438269 12.5472C0.603398 12.7124 0.826778 12.806 1.0603 12.8081C1.29382 12.8101 1.51879 12.7203 1.68677 12.5581L6.72504 7.51981C6.89201 7.35279 6.9858 7.1263 6.9858 6.89014C6.9858 6.65397 6.89201 6.42748 6.72504 6.26046L1.68677 1.22219C1.51975 1.05522 1.29326 0.961426 1.05709 0.961426C0.820931 0.961426 0.594437 1.05522 0.42742 1.22219Z"
        fill={color}
      />
    </svg>
  );
};
