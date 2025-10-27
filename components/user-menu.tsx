"use client";
import { LogOut, Settings, User, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/AuthUserData";
import { useTranslation } from "@/hooks/useTranslate";
import { useState } from "react";
import { UserChangePasswordModal } from "./UserChangePasswordModal";

interface UserMenuProps {
  user?: {
    firstname: string;
    email: string;
    avatar?: string;
    subscriptionPlan?: string;
  };
}

export function UserMenu({
  user,
}: UserMenuProps) {
  const router = useRouter();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const { t } = useTranslation(); // Initialize the translation hook
  const translations = t("userMenu" as any); // Get the specific translations for this component


  const handleLogout = () => {
    if (confirm(translations.logoutConfirm)) {
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 ">
            <AvatarImage
              src={user.profileImage || "/placeholder.svg?height=32&width=32"}
              alt={user.firstname}
            />
            <AvatarFallback>
              {user.firstname ? user.firstname
                .split(" ")
                .map((n) => n[0])
                .join("") : ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.subscriptionPlan && (
              <div className="flex items-center space-x-1 mt-1">
                <Crown className="h-3 w-3 text-yellow-600" />
                <span className="text-xs text-yellow-600 font-medium">
                                   {`${user.subscriptionPlan}${translations.planSuffix}`}

                </span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
           <span>{translations.profile}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/subscription" className="cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
                <span>{translations.subscription}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleChangePasswordClick}
          className="cursor-pointer"
        >
          <Lock className="mr-2 h-4 w-4" />
          <span>{translations.changePassword}</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-[#243b31] focus:text-[#243b31]"
        >
          <LogOut className="mr-2 h-4 w-4" />
         <span>{translations.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {showChangePasswordModal && (
      <UserChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    )}
  </>
  );
}
