"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function IsUserAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("loginData");
    if (!data) {
      router.replace("/login");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsValid(true);
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }, []);

  if (!isValid) return null;

  return <>{children}</>;
}
