import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryProvider } from "./QueryProvider";
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
