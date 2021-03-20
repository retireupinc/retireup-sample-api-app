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
  defaultbg: "", // never to be used this is set by pimco

  tablebg: "#F2F4F7",
  headerbg: "#F2F4F7",
  bodybg: "white",
  tooltipText: "#616263",

  border: "#dcdee3",
  inputBorder: "#8f9399",
  divider: "#dcdee3",

  white: "#ffffff",
  black: "#272b34",
  accent: "#0057b8",

  primary: "#AEE6CB",
  primaryDisabled: "#DCDEE3",
  primaryActive: "#83E4C1",
  primaryHover: "#83E4C1",
  primaryFocus: "#83E4C1",

  secondary: "#aee6cb",
  secondaryDisabled: "#DCDEE3",
  secondaryActive: "rgba(2, 45, 94, 0.05)",
  secondaryHover: "rgba(2, 45, 94, 0.05)",

  scrollBarTrack: "#f2f4f7",
  scrollBarThumb: "#babec7",
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
