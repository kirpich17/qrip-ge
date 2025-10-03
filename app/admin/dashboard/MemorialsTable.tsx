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
import { CheckCircle, CircleMinus, Trash2, CreditCard, DollarSign, Calendar } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import Link from "next/link";

export function MemorialsTable({
  memorials,
  translations,
  fetchAllMemorials,
  memorailStatusToggle,
}: {
  memorials: any[];
  translations: any;
  fetchAllMemorials: any;
  memorailStatusToggle: any;
}) {
  const { t } = useTranslation();
  const admindashTranslations = t("admindash");

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="">
              <TableHead className="min-w-[150px]">
                {admindashTranslations.recentMemorials.tableHeaders.memorial}
              </TableHead>
              <TableHead className="min-w-[150px]">
                {admindashTranslations.recentMemorials.tableHeaders.creator}
              </TableHead>
              <TableHead className="min-w-[120px]">
                Subscription Plan
              </TableHead>
              <TableHead className="min-w-[100px]">
                {admindashTranslations.recentMemorials.tableHeaders.status}
              </TableHead>
              <TableHead className="min-w-[80px]">
                {admindashTranslations.recentMemorials.tableHeaders.views}
              </TableHead>
              <TableHead className="min-w-[150px]">
                {admindashTranslations.recentMemorials.tableHeaders.created}
              </TableHead>
              <TableHead className="min-w-[150px]">
                {admindashTranslations.recentMemorials.tableHeaders.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memorials.map((memorial) => (
              <TableRow key={memorial._id} className="hover:bg-gray-50">
                <TableCell className="font-medium min-w-[150px]">
                  <Link 
                    href={`/memorial/${memorial._id}`} 
                    target="_blank" 
                    className="block w-full h-full hover:text-blue-600"
                  >
                    {memorial.firstName + " " + memorial.lastName}
                  </Link>
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <Link 
                    href={`/memorial/${memorial._id}`} 
                    target="_blank" 
                    className="block w-full h-full hover:text-blue-600"
                  >
                    {memorial?.createdBy?.firstname +
                      " " +
                      memorial?.createdBy?.lastname}
                  </Link>
                </TableCell>
                <TableCell className="min-w-[120px]">
                  <div className="space-y-2">
                    {memorial?.purchase?.planId ? (
                      <>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <div className="text-sm font-medium text-gray-900">
                            {memorial.purchase.planId.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="capitalize">{memorial.purchase.planId.planType}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          <span>{memorial.purchase.finalPricePaid} GEL</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span className="capitalize">{memorial.purchase.duration?.replace('_', ' ')}</span>
                        </div>
                        <Badge 
                          variant={memorial.purchase.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            memorial.purchase.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {memorial.purchase.status}
                        </Badge>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CreditCard className="h-4 w-4" />
                        <span>No subscription</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="min-w-[100px]">
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
                <TableCell className="min-w-[80px]">
                  {memorial.viewsCount}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  {new Date(memorial.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${memorial.status === "active"
                        ? " border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                        : "border-red-600 hover:bg-red-600 text-red-600 hover:text-white"
                        } bg-transparent`}
                      onClick={() => {
                        memorailStatusToggle(memorial._id);
                        console.log("Approve memorial:", memorial._id);
                      }}
                    >
                      {memorial.status === "active" ? (
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
                            `Are you sure you want to reject the memorial for ${memorial.firstName} ${memorial.lastName}?`
                          )
                        ) {
                          axiosInstance
                            .delete("/api/admin/memorial/" + memorial._id)
                            .then(() => {
                              console.log("deleted");
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
      </div>
    </div>
  );
}