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

export function ProfileDropdown() {
  const { t } = useTranslation();
  const profiledropdownTranslations = t("Profiledropdown");
  const router = useRouter();

  const handleSubscriptionClick = () => {
    router.push("/admin/adminsubscription"); // Change route as needed
  };
  const handleProfileClick = () => {
    router.push("/admin/adminprofile"); // Change route as needed
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to sign out?")) {
      logoutUser();
      router.push("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={handleSubscriptionClick}
          className="cursor-pointer"
        >
          {profiledropdownTranslations.subscription}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="cursor-pointer"
        >
          {profiledropdownTranslations.profile}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="cursor-pointer"
        >
          {profiledropdownTranslations.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
