import { COLORS } from "./colors";

const FontFamily = {
  Poppins_Regular: "Poppins_Regular",
  Poppins_SemiBold: "Poppins_SemiBold",
  Poppins_Bold: "Poppins_Bold",
  Poppins_Medium: "Poppins_Medium",
  Poppins_Light: "Poppins_Light",
};

export const typography = {
  Heading1: {
    fontSize: 28,
    fontFamily: FontFamily.Poppins_Bold,
    color: COLORS.PRIMARY.WHITE,
  },
  Heading2: {
    fontSize: 24,
    fontFamily: FontFamily.Poppins_SemiBold,
    lineHeight: 30,
    color: COLORS.PRIMARY.WHITE,
  },
  Heading3: {
    fontSize: 20,
    fontFamily: FontFamily.Poppins_SemiBold,
    color: COLORS.PRIMARY.WHITE,
  },
  Heading4: {
    fontSize: 18,
    fontFamily: FontFamily.Poppins_Bold,
    color: COLORS.PRIMARY.WHITE,
  },
  Heading5: {
    fontSize: 16,
    fontFamily: FontFamily.Poppins_SemiBold,
    color: COLORS.PRIMARY.WHITE,
  },
  Body_Large: {
    fontSize: 16,
    fontFamily: FontFamily.Poppins_Regular,
    color: COLORS.PRIMARY.WHITE,
  },
  Body_Medium: {
    fontSize: 14,
    fontFamily: FontFamily.Poppins_Regular,
    color: COLORS.PRIMARY.WHITE,
  },
  Body_Medium_Semi_Bold: {
    fontSize: 14,
    fontFamily: FontFamily.Poppins_SemiBold,
    color: COLORS.PRIMARY.WHITE,
  },
  Body_Small: {
    fontSize: 12,
    fontFamily: FontFamily.Poppins_Regular,
    color: COLORS.PRIMARY.WHITE,
  },
  Info_Text: {
    fontSize: 16,
    fontFamily: FontFamily.Poppins_Regular,
    color: COLORS.PRIMARY.WHITE,
  },
  Info_Text_Semi_Bold: {
    fontSize: 12,
    fontFamily: FontFamily.Poppins_SemiBold,
    color: COLORS.PRIMARY.WHITE,
  },
  Nav_Bar_Text: {
    fontSize: 11,
    fontFamily: FontFamily.Poppins_Medium,
    color: COLORS.PRIMARY.WHITE,
  },
  Button_Text: {
    fontSize: 16,
    fontFamily: FontFamily.Poppins_SemiBold,
    color: COLORS.PRIMARY.WHITE,
  },
};

export type Typography = keyof typeof typography;
