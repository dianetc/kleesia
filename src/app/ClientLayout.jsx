'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import StoreProvider from "./provider";
import SWR from "./swr";
import MuiThemeProvider from "./theme";
import { ToastContainer } from "react-toastify";
import LoadingScreen from '../components/LoadingScreen';
import { MathJaxContext } from 'better-react-mathjax';

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  startup: {
    pageReady: () => {
      console.log('MathJax is loaded and ready');
      return Promise.resolve();
    }
  }
};

export default function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <MathJaxContext config={config}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <StoreProvider>
          <SWR>
            <MuiThemeProvider>
              <ToastContainer />
              {children}
            </MuiThemeProvider>
          </SWR>
        </StoreProvider>
      )}
    </MathJaxContext>
  );
}
