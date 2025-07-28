"use client";
import { LogOut, Settings, User, Crown } from "lucide-react";
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

interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    plan?: string;
  };
}

export function UserMenu({
  user = { name: "John Doe", email: "john@example.com", plan: "Basic" },
}: UserMenuProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      console.log("Logging out user");
      logoutUser();
      router.push("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.avatar || "/placeholder.svg?height=32&width=32"}
              alt={user.name}
            />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.plan && (
              <div className="flex items-center space-x-1 mt-1">
                <Crown className="h-3 w-3 text-yellow-600" />
                <span className="text-xs text-yellow-600 font-medium">
                  {user.plan} Plan
                </span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/subscription" className="cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </Link>
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
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
