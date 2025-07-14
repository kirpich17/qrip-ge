"use client";

import type React from "react";

import { useState } from "react";
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

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Dummy authentication for admin
    if (email === "admin@qrip.ge" && password === "admin123") {
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } else {
      setError("Invalid admin credentials. Use admin@qrip.ge / admin123");
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
            Administrator Access
          </h1>
          <p className="text-gray-600  mt-2">
            Secure login for system administrators
          </p>
        </div>

        <Card className="shadow-xl ">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Admin Sign In</CardTitle>
            <CardDescription className="text-center  ">
              Enter your administrator credentials
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
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 "
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            {/* <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-400 text-center mb-2">
                Demo Admin Credentials:
              </p>
              <p className="text-xs text-gray-300 text-center">
                Email: admin@qrip.ge
                <br />
                Password: admin123
              </p>
            </div> */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
