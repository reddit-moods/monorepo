import { extendTheme } from "@chakra-ui/react";

const colors = {
  // Reddit Orange
  primary: {
    50: "#FFCBB8",
    100: "#FFBCA3",
    200: "#FF9E7A",
    300: "#FF8152",
    400: "#FF6329",
    500: "#FF4500",
    600: "#C73600",
    700: "#8F2700",
    800: "#571700",
    900: "#1F0800",
    950: "#030100",
  },
  // Other reddit colors
  dark: "#1C1C1C",
  lightblue: "#0079D3",
  lightgray: "#DAE0E6",
};

const customTheme = extendTheme({
  colors,
  fonts: {
    heading: "verdana, arial, helvetica, sans-serif",
    body: "verdana, arial, helvetica, sans-serif",
  },
});

export default customTheme;
