'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import StoreProvider from "./provider";
import SWR from "./swr";
import MuiThemeProvider from "./theme";
import { ToastContainer } from "react-toastify";
import LoadingScreen from '../components/LoadingScreen';

export default function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMathJax = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        setIsLoading(false);
      } else {
        setTimeout(checkMathJax, 100);
      }
    };

    checkMathJax();
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="beforeInteractive"
        onLoad={() => console.log('MathJax script loaded')}
        onError={() => console.error('Failed to load MathJax script')}
      />
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
    </>
  );
}
