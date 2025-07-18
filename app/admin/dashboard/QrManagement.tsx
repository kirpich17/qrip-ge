// components/dashboard/QrManagement.tsx
"use client";

import { QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function QrManagement({ translations }: { translations: any }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">{translations.title}</CardTitle>
        <CardDescription className="">
          {translations.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg">
            <p className="text-2xl font-bold">3,891</p>
            <p className="text-sm">{translations.totalQrCodes}</p>
          </div>
          <div className="text-center p-4 rounded-lg">
            <p className="text-2xl font-bold">28,392</p>
            <p className="text-sm">{translations.totalScans}</p>
          </div>
          <div className="text-center p-4 rounded-lg">
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-sm">{translations.thisMonth}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <QrCode className="h-16 w-16 mx-auto mb-4" />
          <p>{translations.analyticsText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
