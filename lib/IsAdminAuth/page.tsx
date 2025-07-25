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
    const data = localStorage.getItem("loginData");

    if (!data) {
      router.replace("/admin/login");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      if (parsed?.token) {
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
