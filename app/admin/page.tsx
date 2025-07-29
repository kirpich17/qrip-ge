"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      router.push("/admin/dashboard"); // typo? maybe /admin/dashboard?
    } else {
      router.push("/admin/login");
    }
  }, []);

  return <div>Redirecting...</div>;
}

export default Page;
