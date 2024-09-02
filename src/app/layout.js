import "./globals.css";

import StoreProvider from "./provider";

import SWR from "./swr";
import Box from "@mui/material/Box";
import MuiThemeProvider from "./theme";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from 'next/script';

export const metadata = {
  title: "kleesia",
  description: "Forum for Learners",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <StoreProvider>
          <SWR>
            <MuiThemeProvider>
              <ToastContainer />
              {children}
            </MuiThemeProvider>
          </SWR>
        </StoreProvider>
      </body>
    </html>
  );
}
