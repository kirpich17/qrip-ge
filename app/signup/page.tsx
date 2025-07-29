"use client";

import type React from "react";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance, { BASE_URL } from "@/services/axiosInstance";
import { CREATE_AUTH_REGISTER } from "@/services/apiEndPoint";
import { toast } from "react-toastify";

export default function SignupPage() {
  const { t } = useTranslation();
  const authTranslations: any = t("auth" as any);
  const commonTranslations = t("common");

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("passwords don't match")
      return
    }
    setIsLoading(true)
    let body = {
      firstname: formData?.firstName,
      lastname: formData?.lastName,
      email: formData?.email,
      password: formData?.password
    }
    try {
      const response = await axiosInstance.post(
        `${CREATE_AUTH_REGISTER}`,
        body
      );
      const responseMessage = response?.data?.metadata?.message
      if (response.status === 201) {
        toast.success(responseMessage);
        router.push("/login");
        return response;
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message);
      } else if (error?.response?.status === 500) {
        toast.error(error?.response?.data?.message);
      }
    }
    setIsLoading(false)
    // setIsLoading(true);

    // // Simulate signup process
    // setTimeout(() => {
    //   router.push("/dashboard");
    // }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            {authTranslations.signup.createAccount}
          </h1>
          <p className="text-gray-600 mt-2">
            {authTranslations.signup.startHonoringMemories}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {authTranslations.signup.signUp}
            </CardTitle>
            <CardDescription className="text-center">
              {authTranslations.signup.createAccountDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {authTranslations.signup.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={authTranslations.signup.firstNamePlaceholder}
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {authTranslations.signup.lastName}
                  </Label>
                  <Input
                    id="lastName"
                    placeholder={authTranslations.signup.lastNamePlaceholder}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{authTranslations.signup.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={authTranslations.signup.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {authTranslations.signup.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={authTranslations.signup.passwordPlaceholder}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {authTranslations.signup.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={
                    authTranslations.signup.confirmPasswordPlaceholder
                  }
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  {authTranslations.signup.agreeToTerms}{" "}
                  <Link
                    href="/terms"
                    className="text-[#243b31]  hover:underline"
                  >
                    {authTranslations.signup.termsOfService}
                  </Link>{" "}
                  {authTranslations.signup.and}{" "}
                  <Link
                    href="/privacy"
                    className="text-[#243b31]  hover:underline"
                  >
                    {authTranslations.signup.privacyPolicy}
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {authTranslations.signup.alreadyHaveAccount}{" "}
                <Link
                  href="/login"
                  className="text-[#243b31] hover:underline font-medium"
                >
                  {authTranslations.signup.signIn}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


