"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslate";
import { toast } from "react-toastify";

function SetNewPasswordForm() {
  const { t } = useTranslation();
  const authTranslations = t("auth");
  const commonTranslations = t("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError(
        authTranslations?.setNewPassword?.invalidLink ||
          "Invalid reset link"
      );
      return;
    }
    if (!password || !confirmPassword) {
      setError(
        authTranslations?.setNewPassword?.requiredFields ||
          "Both password fields are required"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        authTranslations?.setNewPassword?.passwordsMismatch ||
          "Passwords do not match"
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success(
          authTranslations?.setNewPassword?.successMessage || 
          "Password updated successfully"
        );
      } else {
        setError(
          data.message || 
          authTranslations?.setNewPassword?.errorMessage || 
          "Failed to update password"
        );
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      const genericError =
        authTranslations?.setNewPassword?.errorMessage ||
        "An error occurred. Please try again.";
      setError(genericError);
      toast.error(genericError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-center">
          {authTranslations?.setNewPassword?.cardTitle || "New Password"}
        </CardTitle>
        <CardDescription className="text-center">
          {authTranslations?.setNewPassword?.cardDescription || 
           "Enter and confirm your new password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {authTranslations?.setNewPassword?.successMessage || 
                   "Password updated successfully!"}
                </AlertDescription>
              </div>
            </Alert>
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full mt-4"
            >
              {authTranslations?.setNewPassword?.backToLogin || 
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
              <Label htmlFor="password">
                {authTranslations?.setNewPassword?.newPasswordLabel || 
                 "New Password"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  authTranslations?.setNewPassword?.passwordPlaceholder || 
                  "Enter new password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {authTranslations?.setNewPassword?.confirmPasswordLabel || 
                 "Confirm Password"}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={
                  authTranslations?.setNewPassword?.confirmPasswordPlaceholder || 
                  "Confirm new password"
                }
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
                ? authTranslations?.setNewPassword?.updating || "Updating..."
                : authTranslations?.setNewPassword?.updateButton || 
                   "Update Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function SetNewPasswordPage() {
  const { t } = useTranslation();
  const authTranslations = t("auth");

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
              <Lock className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-[#243b31]">QRIP.ge</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {authTranslations?.setNewPassword?.title || "Set New Password"}
          </h1>
          <p className="text-gray-600 mt-2">
            {authTranslations?.setNewPassword?.subtitle || 
             "Create a new password for your account"}
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <SetNewPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}