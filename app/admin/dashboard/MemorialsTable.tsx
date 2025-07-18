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
import { CheckCircle, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

export function MemorialsTable({
  memorials,
  translations,
}: {
  memorials: any[];
  translations: any;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const admindashTranslations = t("admindash");
  const handleProfileClick = () => {
    router.push("/memorial/demo"); // Change route as needed
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
          <TableRow key={memorial.id} className="">
            <TableCell className="font-medium">{memorial.name}</TableCell>
            <TableCell className="">{memorial.creator}</TableCell>
            <TableCell>
              <Badge
                variant={
                  memorial.status === "approved" ? "default" : "secondary"
                }
                className={
                  memorial.status === "approved"
                    ? "bg-green-600"
                    : "bg-yellow-600"
                }
              >
                {memorial.status}
              </Badge>
            </TableCell>
            <TableCell className="">{memorial.views}</TableCell>
            <TableCell className="">{memorial.created}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleProfileClick}
                  size="sm"
                  variant="outline"
                  className="border-[#354f44] text-black "
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 bg-transparent"
                  onClick={() => {
                    console.log("Approve memorial:", memorial.id);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 bg-transparent"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to reject the memorial for ${memorial.name}?`
                      )
                    ) {
                      console.log("Reject memorial:", memorial.id);
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
