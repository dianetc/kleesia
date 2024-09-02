import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "kleesia",
  description: "Forum for Learners",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
