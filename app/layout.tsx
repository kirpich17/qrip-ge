import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
