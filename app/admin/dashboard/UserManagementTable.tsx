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
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";

export function UserManagementTable({
  users,
  translations,
  userStatusToggle,
  fetchAllUsers,
}: {
  users: any[];
  translations: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const admindashTranslations = t("admindash");
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="">
            {admindashTranslations.userManagement.tableHeaders.user}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.userManagement.tableHeaders.plan}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.userManagement.tableHeaders.memorials}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.userManagement.tableHeaders.status}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.userManagement.tableHeaders.joined}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.userManagement.tableHeaders.actions}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user._id} className="">
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {/* <AvatarImage src={user.avatar || "/placeholder.svg"} /> */}
                  <AvatarFallback>
                    {user.firstname[0] + user.lastname[0]}
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
                variant={
                  user.subscriptionPlan === "Premium" ? "default" : "secondary"
                }
                className={
                  user.subscriptionPlan === "Premium" ? "bg-yellow-600 " : ""
                }
              >
                {user.subscriptionPlan}
              </Badge>
            </TableCell>
            <TableCell className="">{user.memorialCount}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.accountStatus === "active" ? "default" : "destructive"
                }
                className={
                  user.accountStatus === "active" ? "bg-green-600" : ""
                }
              >
                {user.accountStatus}
              </Badge>
            </TableCell>
            <TableCell className="">
              {new Date(user.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "UTC", // or your local timezone
              })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  {/* <DropdownMenuItem
                    className="hover:text-white cursor-pointer"
                    onClick={() => {
                      console.log("View profile for user:", user.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {translations.actionsMenu.viewProfile}
                  </DropdownMenuItem> */}

                  <DropdownMenuItem
                    className="hover:text-white cursor-pointer"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to suspend ?`
                        )
                      ) {
                        console.log("Suspend user:", user._id);
                        userStatusToggle(user._id);
                      }
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {user.accountStatus === "active"
                      ? translations.actionsMenu.suspend
                      : "active"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete ${user.name}? This action cannot be undone.`
                        )
                      ) {
                        axiosInstance
                          .delete("/api/admin/user/" + user._id)
                          .then(() => {
                            console.log("deletd");
                            fetchAllUsers();
                          });
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
    </div>
    </div>
  );
}
