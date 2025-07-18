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
import { CheckCircle, Trash2 } from "lucide-react";

export function MemorialsTable({
  memorials,
  translations,
}: {
  memorials: any[];
  translations: any;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="">{translations.memorial}</TableHead>
          <TableHead className="">{translations.creator}</TableHead>
          <TableHead className="">{translations.status}</TableHead>
          <TableHead className="">{translations.views}</TableHead>
          <TableHead className="">{translations.created}</TableHead>
          <TableHead className="">{translations.actions}</TableHead>
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
