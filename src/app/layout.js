import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from './ClientLayout';
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
