import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryProvider } from "./QueryProvider";
import "@/services/authDebug"; // Import debug utilities
// const inter = Inter({ subsets: ["latin"] });

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter' // Add this line
});

export const metadata: Metadata = {
  title: "QRIP.ge - Digital Memorial Platform",
  description: "Honor memories forever with QR-based digital memorials",
  generator: "qrip.ge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en"> 
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-77FDP190DR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-77FDP190DR');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
            <QueryProvider> 
          <ClientLayout>{children}</ClientLayout>
        <ToastContainer position="top-right" autoClose={5000}   className="toast-container" />
        </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
