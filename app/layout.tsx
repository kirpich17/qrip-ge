import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="English">
      <body className={inter.className}>
        <LanguageProvider>
        <ToastContainer position="top-right" autoClose={5000} />
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
