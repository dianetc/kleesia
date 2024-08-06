import "./globals.css";

import StoreProvider from "./provider";

import SWR from "./swr";
import MuiThemeProvider from "./theme";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "kleesia",
  description: "CS - Forum for University students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
