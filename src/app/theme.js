"use client";

import localFont from "next/font/local";
import { createTheme } from "@mui/material/styles";

const Satoshi = localFont({ src: "font/satoshi.ttf" });

import { ThemeProvider } from "@emotion/react";

console.log(Satoshi);

const theme = createTheme({
  palette: {
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
      main: "#E8E8E8",
    },
  },
  typography: {
    fontFamily: "'Satoshi', sans-serif",
    body2: {
      fontsize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Satoshi', sans-serif;
          src: local('Satoshi) url(${Satoshi}) format('ttf');
        }
      `,
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:focus": {
            border: "none",
          },
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        defaultProps: {
          disableElevation: true,
        },

        contained: {
          "&:hover": {
            color: "#FEC200",
          },
        },
        fixed: {
          color: "#050E28",
          border: "1px solid #BEBEBE",
        },
        outlined: {
          color: "#050E28",
          border: "1px solid #BEBEBE",
          "&:hover": {
            border: "1px solid #050E28",
            background: "#050E28",
            color: "#FEC200",
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
