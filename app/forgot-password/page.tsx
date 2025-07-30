"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
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
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const authTranslations = t("auth");
  const commonTranslations = t("common");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      // Replace with your actual API call
      const response = await fetch("https://qrip-ge-backend.vercel.app/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        toast.success(
          authTranslations?.forgotPassword?.successMessage || 
          "Password reset link sent to your email"
        );
      } else {
        setError(
          data.message || 
          authTranslations?.forgotPassword?.errorMessage || 
          "Failed to send reset link"
        );
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError(
        authTranslations?.forgotPassword?.errorMessage || 
        "An error occurred. Please try again."
      );
      toast.error("An error occurred. Please try again.");
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
              <Mail className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-[#243b31]">QRIP.ge</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {authTranslations?.forgotPassword?.title || "Forgot Password?"}
          </h1>
          <p className="text-gray-600 mt-2">
            {authTranslations?.forgotPassword?.subtitle || 
             "Enter your email to receive a reset link"}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {authTranslations?.forgotPassword?.cardTitle || "Reset Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {authTranslations?.forgotPassword?.cardDescription || 
               "We'll send you instructions to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {authTranslations?.forgotPassword?.successMessage || 
                       "Password reset link sent to your email"}
                    </AlertDescription>
                  </div>
                </Alert>
                <p className="text-sm text-gray-600 text-center">
                  {authTranslations?.forgotPassword?.checkEmail || 
                   "Please check your inbox and follow the instructions"}
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full mt-4"
                >
                  {authTranslations?.forgotPassword?.backToLogin || 
                   "Back to Login"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {commonTranslations?.email || "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      authTranslations?.forgotPassword?.emailPlaceholder || 
                      "your@email.com"
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? authTranslations?.forgotPassword?.sending || "Sending..."
                    : authTranslations?.forgotPassword?.sendInstructions || 
                       "Send Reset Link"}
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-[#243b31] hover:underline flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {authTranslations?.forgotPassword?.backToLogin || 
                     "Back to Login"}
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}