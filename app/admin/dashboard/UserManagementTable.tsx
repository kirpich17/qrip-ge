// components/dashboard/UserManagementTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Ban, Trash2 } from "lucide-react";

export function UserManagementTable({
  users,
  translations,
}: {
  users: any[];
  translations: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="">{translations.user}</TableHead>
          <TableHead className="">{translations.plan}</TableHead>
          <TableHead className="">{translations.memorials}</TableHead>
          <TableHead className="">{translations.status}</TableHead>
          <TableHead className="">{translations.joined}</TableHead>
          <TableHead className="">{translations.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="">
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={user.plan === "Premium" ? "default" : "secondary"}
                className={user.plan === "Premium" ? "bg-yellow-600 " : ""}
              >
                {user.plan}
              </Badge>
            </TableCell>
            <TableCell className="">{user.memorials}</TableCell>
            <TableCell>
              <Badge
                variant={user.status === "active" ? "default" : "destructive"}
                className={user.status === "active" ? "bg-green-600" : ""}
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell className="">{user.joined}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem
                    className="hover:text-white cursor-pointer"
                    onClick={() => {
                      console.log("View profile for user:", user.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {translations.actionsMenu.viewProfile}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:text-white cursor-pointer"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to suspend ${user.name}?`
                        )
                      ) {
                        console.log("Suspend user:", user.id);
                      }
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {translations.actionsMenu.suspend}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete ${user.name}? This action cannot be undone.`
                        )
                      ) {
                        console.log("Delete user:", user.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {translations.actionsMenu.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
