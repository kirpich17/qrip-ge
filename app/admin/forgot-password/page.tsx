"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, QrCode, Mail } from "lucide-react";
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
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "@/hooks/useTranslate";

export default function AdminForgotPasswordPage() {
  const { t } = useTranslation();
  // @ts-ignore - adminlogin is not in Translations type but exists in JSON files
  const adminForgotPasswordTranslations = t("adminlogin" as any)?.forgotPassword || {};
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError(adminForgotPasswordTranslations.enterEmail || "Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}api/admin/forgot-password`,
        { email }
      );

      if (response.data.status) {
        setSuccess(true);
        toast.success(adminForgotPasswordTranslations.emailSentSuccess || "Password reset link sent to your email");
      } else {
        setError(response.data.message || adminForgotPasswordTranslations.emailSentError || "Failed to send reset email");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || adminForgotPasswordTranslations.errorOccurred || "An error occurred while sending reset email"
        );
      } else {
        setError(adminForgotPasswordTranslations.errorOccurred || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
              href="/admin/login"
              className="flex items-center justify-center space-x-3 my-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-[#243b31] rounded-xl"
              >
                <QrCode className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-[#243b31]">QRIP.ge</span>
            </Link>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-600">
                {adminForgotPasswordTranslations.successTitle || "Check Your Email"}
              </CardTitle>
              <CardDescription>
                {adminForgotPasswordTranslations.successMessage || "We've sent a password reset link to your email address."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500 bg-green-900/20">
                <AlertDescription className="text-green-400">
                  {adminForgotPasswordTranslations.checkSpam || "If you don't see the email, please check your spam folder."}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/admin/login")}
                  className="w-full bg-[#547455] hover:bg-[#243b31]"
                >
                  {adminForgotPasswordTranslations.backToLogin || "Back to Login"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
            href="/admin/login"
            className="flex items-center justify-center space-x-3 my-4"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#243b31] rounded-xl"
            >
              <QrCode className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-[#243b31]">QRIP.ge</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {adminForgotPasswordTranslations.pageTitle || "Forgot Password"}
          </h1>
          <p className="text-gray-600 mt-2">
            {adminForgotPasswordTranslations.subtitle || "Enter your admin email and we'll send you a link to reset your password."}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {adminForgotPasswordTranslations.resetTitle || "Reset Admin Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {adminForgotPasswordTranslations.description || "Enter your admin email address"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500 bg-red-900/20">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  {adminForgotPasswordTranslations.emailLabel || "Email Address"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={adminForgotPasswordTranslations.emailPlaceholder || "Enter your admin email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full"
                disabled={isLoading}
              >
                {isLoading ? (adminForgotPasswordTranslations.sending || "Sending...") : (adminForgotPasswordTranslations.sendButton || "Send Reset Link")}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Link
                href="/admin/login"
                className="text-sm text-[#547455] hover:text-[#243b31] hover:underline font-medium"
              >
                {adminForgotPasswordTranslations.backToLogin || "Back to Login"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
