"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslate";
import { logoutUser } from "@/services/AuthUserData";
import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function ProfileDropdown() {
  const { t } = useTranslation();
  const profiledropdownTranslations = t("Profiledropdown" as any);
  const router = useRouter();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleSubscriptionClick = () => {
    router.push("/admin/adminsubscription"); // Change route as needed
  };

  const handleTermsAndConditionClick = () => {
    router.push("/admin/termAndCondition"); // Change route as needed
  };

  const handleProfileClick = () => {
    router.push("/admin/adminprofile"); // Change route as needed
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.clear();
      logoutUser();
      router.push("/");
    }
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50  ">
          <DropdownMenuItem
            onClick={handleSubscriptionClick}
            className="cursor-pointer"
          >
            {profiledropdownTranslations.subscription}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleTermsAndConditionClick}
            className="cursor-pointer"
          >
            {profiledropdownTranslations.termsAndCondition}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleChangePasswordClick}
            className="cursor-pointer"
          >
            {profiledropdownTranslations.changePassword}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="cursor-pointer"
          >
            {profiledropdownTranslations.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
}
