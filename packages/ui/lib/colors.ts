export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
    WHITE: string;
    BLACK: string;
    BLACK_50: string;
  };
  neutral: {
    10: string;
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  success: {
    100: string;
    200: string;
    500: string;
    600: string;
    800: string;
  };
  error: {
    200: string;
    500: string;
    800: string;
  };
  warning: {
    200: string;
    500: string;
    800: string;
  };
  info: {
    200: string;
    500: string;
    800: string;
  };
}

export const COLORS: ColorPalette = {
  primary: {
    50: "rgba(238, 247, 245, 1)",
    100: "rgb(200, 233, 229)",
    200: "rgb(151, 204, 195)",
    300: "rgb(83, 186, 169)",
    400: "rgb(53, 131, 118)",
    500: "rgb(28, 70, 63)",
    600: "rgb(23, 58, 53)",
    700: "rgb(19, 47, 42)",
    800: "rgb(15, 34, 31)",
    900: "rgb(10, 23, 21)",
    950: "rgb(8, 18, 16)",
    WHITE: "rgba(255, 255, 255, 1)",
    BLACK: "rgba(13, 13, 13, 1)",
    BLACK_50: "rgba(0, 0, 0, 0.5)",
  },

  neutral: {
    10: "rgba(251, 251, 249, 1)",
    50: "rgb(242, 242, 242)",
    100: "rgb(233, 233, 233)",
    200: "rgb(214, 214, 214)",
    300: "rgb(195, 195, 195)",
    400: "rgb(177, 177, 177)",
    500: "rgb(158, 158, 158)",
    600: "rgba(126, 126, 126, 1)",
    700: "rgb(93, 93, 93)",
    800: "rgb(61, 61, 61)",
    900: "rgb(29, 29, 29)",
    950: "rgb(13, 13, 13)",
  },

  success: {
    100: "rgba(217, 255, 217, 1)",
    200: "rgb(187, 220, 188)",
    500: "rgb(76, 175, 80)",
    600: "rgba(63, 103, 63, 1)",
    800: "rgb(32, 68, 34)",
  },

  error: {
    200: "rgb(243, 184, 180)",
    500: "rgb(244, 67, 54)",
    800: "rgb(105, 16, 11)",
  },

  warning: {
    200: "rgb(245, 212, 163)",
    500: "rgb(255, 152, 0)",
    800: "rgb(97, 60, 5)",
  },

  info: {
    200: "rgb(173, 211, 242)",
    500: "rgb(33, 150, 243)",
    800: "rgb(10, 60, 99)",
  },
};

export type ColorKey = keyof typeof COLORS;
