import "./fonts.css";

export const FontFamily = {
  Poppins_Regular: "Poppins-Regular",
  Poppins_Medium: "Poppins-Medium",
  Poppins_SemiBold: "Poppins-SemiBold",
  Poppins_Bold: "Poppins-Bold",
} as const;

export type FontKey = keyof typeof FontFamily;
export type FontFamilyType = typeof FontFamily;

export const typography = {
  Heading0: {
    fontSize: "3rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Heading1: {
    fontSize: "2.75rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "3.25rem",
    letterSpacing: "0px",
  },
  Heading2: {
    fontSize: "2.5rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Heading3: {
    fontSize: "2rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Heading4: {
    fontSize: "1.5rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Heading5: {
    fontSize: "1.25rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Heading6: {
    fontSize: "1.125rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Heading7: {
    fontSize: "1rem",
    fontFamily: FontFamily.Poppins_Medium,
    lineHeight: "120%",
    letterSpacing: "0px",
  },

  Body_Title1: {
    fontSize: "2rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title2: {
    fontSize: "1.75rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title3: {
    fontSize: "1.5rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title4: {
    fontSize: "1.25rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title5: {
    fontSize: "1.125rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title6: {
    fontSize: "1rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title7: {
    fontSize: "0.875rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Body_Title8: {
    fontSize: "0.75rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },

  Button_Large: {
    fontSize: "1rem",
    fontFamily: FontFamily.Poppins_SemiBold,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Button_Medium: {
    fontSize: "0.875rem",
    fontFamily: FontFamily.Poppins_SemiBold,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Button_Small: {
    fontSize: "0.625rem",
    fontFamily: FontFamily.Poppins_SemiBold,
    lineHeight: "120%",
    letterSpacing: "0px",
  },

  Caption_Large: {
    fontSize: "0.875rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Caption_Medium: {
    fontSize: "0.75rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
  Caption_Small: {
    fontSize: "0.625rem",
    fontFamily: FontFamily.Poppins_Regular,
    lineHeight: "120%",
    letterSpacing: "0px",
  },
} as const;

export type TypographyOptions = typeof typography;
