import { BreakPoints, Media } from "./breakpoints";
import { ColorPalette, COLORS } from "./colors";
import { typography, TypographyOptions } from "./typography";

export interface Theme {
  colors: ColorPalette;
  typography: TypographyOptions;
  media: BreakPoints;
}

export const theme: Theme = {
  colors: COLORS,
  typography,
  media: Media,
};
