"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const router = useRouter();

  const handleSubscriptionClick = () => {
    router.push("/admin/adminsubscription"); // Change route as needed
  };

  const handleLogoutClick = () => {
    // Replace with actual logout logic
    console.log("Logging out...");
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
          Subscription
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
