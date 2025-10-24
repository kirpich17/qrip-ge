"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function IsAdminAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!loginData || !authToken || !isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    try {
      const parsed = JSON.parse(loginData);
      // Check if user is admin and token exists
      if (parsed?.userType === "admin" && authToken) {
        setIsValid(true);
      } else {
        router.replace("/admin/login");
      }
    } catch {
      router.replace("/admin/login");
    }
  }, []);

  if (!isValid) return null;

  return <>{children}</>;
}
