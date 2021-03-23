import { colors } from "../../../utils/styles";

export const MIN_CHART_WIDTH = 520;
export const YAXIS_WIDTH = 50;

export const LEGEND_COLORS = {
  income: colors.teal,
  other: colors.black,
  ss: colors.purple,
  pension: colors.red,
  annuity: colors.orange,
  assets: colors.yellow,
};

export const MARGIN = {
  top: 20,
  right: 0,
  bottom: 20,
  left: 0,
};

export const LIST = {
  visible: {
    transition: {
      staggerChildren: 0.01,
    },
  },
  enter: {
    transition: {
      staggerChildren: 0.01,
    },
  },
};
