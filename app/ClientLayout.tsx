"use client";

import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import { usePathname } from "next/navigation";

const showHeaderFooterRoutes = ["/", "/about", "/contact", "/memorials"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeaderFooter = showHeaderFooterRoutes.includes(pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}
