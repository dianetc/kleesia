"use client";

import localFont from "next/font/local";
import { createTheme } from "@mui/material/styles";

const Satoshi = localFont({ src: "font/satoshi.ttf" });

import { ThemeProvider } from "@emotion/react";

const theme = createTheme({
  palette: {
    primary: {
      light: "#FEC200",
      main: "#FEC200",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#050E28",
      main: "#050E28",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: "Satoshi, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Satoshi', sans-serif;
          src: local('Satoshi) url(./font/satoshi.ttf) format('ttf');
        }
      `,
    },
  },
});

let MuiThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
export default MuiThemeProvider;
