"use client";

import localFont from "next/font/local";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Satoshi = localFont({ src: "font/satoshi.ttf" });

const palette = {
  primary: {
    light: "#FEC200",
    main: "#FEC200",
    dark: "#050E28",
    contrastText: "#050E28",
  },
  secondary: {
    light: "#050E28",
    main: "#050E28",
    dark: "#FEC200",
    contrastText: "#FEC200",
  },
  background: {
    main: "#F6F6F6",
    border: "#DEDEDE",
    slate: "#BEBEBE",
  },
  chip: [
    "rgba(40, 216, 30, .2)",
    "rgba(216, 119, 30, .2)",
    "rgba(30, 77, 216, .2)",
    "rgba(31, 200, 223, .2)",
  ],
};

const theme = createTheme({
  palette,
  typography: {
    fontFamily: "Satoshi, sans-serif",
    body2: {
      fontsize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `@font-face { font-family: 'Satoshi', sans-serif; url(${Satoshi}) format('ttf');}`,
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: `1px solid ${palette.background.border}`,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: `1px solid ${palette.background.border}`,
          transformOrigin: "top",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        "&:before": {
          border: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        contained: {
          "&:hover": {
            color: palette.primary.main,
          },
        },
        fixed: {
          color: palette.secondary.main,
          border: `1px solid ${palette.background.border}`,
        },
        outlined: {
          color: palette.secondary.main,
          border: `1px solid ${palette.secondary.main}`,
          "&:hover": {
            color: palette.primary.main,
            border: `1px solid ${palette.secondary.main}`,
            background: palette.secondary.main,
          },
        },
        root: {
          textTransform: "capitalize",
        },
      },
    },
  },
});

let MuiThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
export default MuiThemeProvider;
