// components/dashboard/AnalyticsCharts.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsCharts({ translations }: { translations: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="">{translations.platformGrowth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            {translations.platformGrowth}
          </div>
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="">{translations.revenueTrends}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            {translations.revenueTrends}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
