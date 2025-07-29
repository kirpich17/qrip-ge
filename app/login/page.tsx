"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, QrCode, ArrowLeft } from "lucide-react";
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
import axios from "axios";
import { LOGIN } from "@/services/apiEndPoint";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { t } = useTranslation();
  const authTranslations: any = t("auth" as any);
  const commonTranslations: any = t("common");

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      router.replace("/dashboard");
    }
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const body = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${LOGIN}`,
        body
      );

      const { status, message, token, user } = response?.data || {};

      if (status) {
        localStorage.setItem("loginData", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", user?.userType || "");
        localStorage.setItem("isAuthenticated", "true");
        toast.success(message || "Login successful!");
        if (user?.userType === "admin" || user?.userType === "manager") {
          router.push("/admin");
        } else if (user?.userType === "underwriter") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.message || "Invalid credentials");
      } else if (error?.response?.status === 404) {
        toast.error("Something went wrong. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setError("");
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
            {authTranslations.login.welcomeBack}
          </h1>
          <p className="text-gray-600 mt-2">
            {authTranslations.login.subtitle}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {authTranslations.login.title}
            </CardTitle>
            <CardDescription className="text-center">
              {authTranslations.login.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{commonTranslations.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={authTranslations.login.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{commonTranslations.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={authTranslations.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12"
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

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#243b31] hover:underline"
                >
                  {authTranslations.login.forgotPassword}
                </Link>
              </div>

              <Button
                type="submit"
                className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? authTranslations.login.signingIn
                  : authTranslations.login.signIn}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {authTranslations.login.noAccount}{" "}
                <Link
                  href="/signup"
                  className="text-[#243b31] hover:underline font-medium"
                >
                  {authTranslations.login.signUp}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
