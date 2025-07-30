// components/dashboard/MemorialsTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleMinus, Cross, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

export function MemorialsTable({
  memorials,
  translations,
  fetchAllMemorials,
  memorailStatusToggle,
}: {
  memorials: any[];
  translations: any;
  fetchAllMemorials: any;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const admindashTranslations = t("admindash");
  const handleProfileClick = (id) => {
    router.push("/memorial/" + id); // Change route as needed
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="">
            {admindashTranslations.recentMemorials.tableHeaders.memorial}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.recentMemorials.tableHeaders.creator}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.recentMemorials.tableHeaders.status}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.recentMemorials.tableHeaders.views}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.recentMemorials.tableHeaders.created}
          </TableHead>
          <TableHead className="">
            {admindashTranslations.recentMemorials.tableHeaders.actions}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memorials.map((memorial) => (
          <TableRow key={memorial._id} className="">
            <TableCell className="font-medium">
              {memorial.firstName + " " + memorial.lastName}
            </TableCell>
            <TableCell className="">
              {memorial?.createdBy?.firstname +
                " " +
                memorial?.createdBy?.lastname}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  memorial.status === "active" ? "default" : "secondary"
                }
                className={
                  memorial.status === "active"
                    ? "!bg-green-600 text-white"
                    : "!bg-red-600 text-white"
                }
              >
                {memorial.status}
              </Badge>
            </TableCell>
            <TableCell className="">{memorial.views}</TableCell>
            <TableCell className="">
              {" "}
              {new Date(memorial.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "UTC", // or your local timezone
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleProfileClick(memorial._id)}
                  size="sm"
                  variant="outline"
                  className="border-[#354f44] text-black hover:bg-[#354f44] hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`${
                    memorial.status === "active"
                      ? " border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                      : "border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white"
                  } bg-transparent`}
                  onClick={() => {
                    memorailStatusToggle(memorial._id);
                    console.log("Approve memorial:", memorial._id);
                  }}
                >
                  {memorial.status === "active" ? (
                    // <Cross className="h-4 w-4" />
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    
                    <CircleMinus className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 bg-transparent hover:bg-red-600 hover:text-white"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to reject the memorial for ${memorial.name}?`
                      )
                    ) {
                      axiosInstance
                        .delete("/api/admin/memorial/" + memorial._id)
                        .then(() => {
                          console.log("deletd");
                          fetchAllMemorials();
                        });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
