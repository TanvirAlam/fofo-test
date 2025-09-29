export const COLORS = {
  PRIMARY: {
    ORANGE: "rgba(255, 111, 60, 1)",
    GREEN: "rgba(76, 175, 80, 1)",
    RED: "rgba(255, 59, 48, 1)",
    BLUE: "rgba(0, 122, 255, 1)",
    WHITE: "rgba(255, 255, 255, 1)",
    BLACK: "rgba(0, 0, 0, 1)",
    GRAY: "rgba(158, 158, 158, 1)",
    DARK: "rgba(44, 44, 44, 1)",
  },
  SECONDARY: {
    ORANGE_LIGHT: "rgba(255, 209, 179, 1)",
    YELLOW: "rgba(255, 183, 3, 1)",
    BROWN: "rgba(141, 110, 99, 1)",
    LIGHT: "rgba(250, 250, 250, 1)",
    DARK_GRAY: "rgba(51, 51, 51, 1)",
    MEDIUM_GRAY: "rgba(68, 68, 68, 1)",
    LIGHT_GRAY: "rgba(245, 245, 245, 1)",
    BLACK_OPACITY_50: "rgba(0, 0, 0, 0.5)",
    WHITE_OPACITY_70: "rgba(255, 255, 255, 0.7)",
  },
};

export type Theme = keyof typeof COLORS;
