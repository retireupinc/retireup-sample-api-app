export const $emBase = 16;
export const rem = (pixels) => `${pixels / $emBase}rem`;

export const font = {
  sizes: {
    xs: rem(12),
    sm: rem(14),
    base: rem(16),
    xl: rem(20),
    xxl: rem(24),
    xxxl: rem(36),
    xxxxl: rem(40),
  },
};

export const screen = {
  sm: "@media (min-width: 600px)",
  lg: "@media (min-width: 900px)",
  xl: "@media (min-width: 1200px)",
};

export const spacing = {
  s0: "0",
  s1: ".25rem",
  s2: ".5rem",
  s2_1: ".75rem",
  s3: "1rem",
  s4: "1.5rem",
  s5: "3rem",
};

export const colors = {
  white: "#ffffff",
  black: "#272b34",
  primary: "#007bff",
  secondary: "#868e96",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
  light: "#f8f9fa",
  dark: "#343a40",
  blue: "#007bff",
  indingo: "#6610f2",
  purple: "#6f42c1",
  pink: "#e83e8c",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#28a745",
  teal: "#20c997",
  cyan: "#17a2b8",
  divider: "#dcdee3",
};

const pseudoClass = "::";
const scrollbarWidths = {};
export const getScrollbarWidth = (className) => {
  const cache = className || pseudoClass;
  if (!scrollbarWidths[cache]) {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.cssText =
      "width:100px;height:100px;overflow:scroll !important;position:absolute;top:-9999px;";
    if (className) {
      scrollDiv.className = className;
    }
    document.body.appendChild(scrollDiv);
    scrollbarWidths[cache] = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }
  return scrollbarWidths[cache];
};

export const updateScrollbarWidths = () => {
  Object.keys(scrollbarWidths).forEach((cache) => {
    delete scrollbarWidths[cache];
    getScrollbarWidth(cache !== pseudoClass && cache);
  });
};

window.addEventListener("resize", updateScrollbarWidths, false);
window.addEventListener("pageshow", updateScrollbarWidths, false);
window.addEventListener("orientationchange", updateScrollbarWidths, false);
