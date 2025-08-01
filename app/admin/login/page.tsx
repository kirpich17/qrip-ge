// @ts-nocheck
"use client";

import type React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, ArrowLeft, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslate";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const adminloginTranslations = t("adminlogin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      router.push("/admin/dashboard"); // typo? maybe /admin/dashboard?
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://51.20.241.117:5000/api/admin/signIn",
        {
          email,
          password,
        }
      );

      if (response.data.status) {
        // Save the response data to localStorage
        localStorage.setItem("loginData", JSON.stringify(response.data));
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "An error occurred during login"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecefdc] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center space-x-3 my-4"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#243b31] rounded-xl"
            >
              <QrCode className="h-5 w-5 text-white" />{" "}
            </motion.div>
            <span className="text-2xl font-bold text-[#243b31]">QRIP.ge</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {/* // @ts-nocheck */}

            {adminloginTranslations.login.welcomeBack}
          </h1>
          <p className="text-gray-600  mt-2">
            {adminloginTranslations.login.subtitle}
          </p>
        </div>

        <Card className="shadow-xl ">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {adminloginTranslations.login.title}
            </CardTitle>
            <CardDescription className="text-center  ">
              {adminloginTranslations.login.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="border-red-500 bg-red-900/20">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="">
                  {adminloginTranslations.login.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={adminloginTranslations.login.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 "
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="">
                  {adminloginTranslations.login.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      adminloginTranslations.login.passwordPlceholder
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12 "
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? adminloginTranslations.login.logButton
                  : adminloginTranslations.login.logButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
