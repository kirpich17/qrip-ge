"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";

interface UserChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserChangePasswordModal({ isOpen, onClose }: UserChangePasswordModalProps) {
  const { t } = useTranslation();
  const securityTranslations = t("userprofile.security" as any) || {};
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError(securityTranslations.currentPasswordRequired || "Current password is required");
      return false;
    }
    
    if (!formData.newPassword) {
      setError(securityTranslations.newPasswordRequired || "New password is required");
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setError(securityTranslations.passwordMinLength || "New password must be at least 8 characters long");
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError(securityTranslations.passwordsDontMatch || "New passwords don't match");
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError(securityTranslations.passwordMustBeDifferent || "New password must be different from current password");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.put("/api/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      if (response.data.status) {
        toast.success(securityTranslations.passwordChangedSuccessfully || "Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      } else {
        setError(response.data.message || (securityTranslations.failedToChangePassword || "Failed to change password"));
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(securityTranslations.errorOccurredWhileChangingPassword || "An error occurred while changing password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {securityTranslations.changePassword || "Change Password"}
          </DialogTitle>
          <DialogDescription>
            {securityTranslations.enterCurrentPasswordAndChooseNew || "Enter your current password and choose a new secure password."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{securityTranslations.currentPassword || "Current Password"}</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder={securityTranslations.enterCurrentPassword || "Enter current password"}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
                disabled={isLoading}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">{securityTranslations.newPassword || "New Password"}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder={securityTranslations.enterNewPassword || "Enter new password"}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isLoading}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{securityTranslations.confirmPassword || "Confirm New Password"}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={securityTranslations.confirmNewPassword || "Confirm new password"}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isLoading}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Password Requirements */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{securityTranslations.passwordRequirements || "Password requirements:"}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{securityTranslations.atLeast8Characters || "At least 8 characters long"}</li>
              <li>{securityTranslations.differentFromCurrent || "Different from current password"}</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {securityTranslations.cancel || "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#547455] hover:bg-[#4a654a]"
            >
              {isLoading ? (securityTranslations.changing || "Changing...") : (securityTranslations.changePassword || "Change Password")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
