// components/dashboard/PlatformSettings.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function PlatformSettings({ translations }: { translations: any }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">{translations.title}</CardTitle>
        <CardDescription className="">
          {translations.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {translations.generalSettings}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="">{translations.publicDirectory.label}</p>
                  <p className="text-sm">
                    {translations.publicDirectory.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Configure public directory settings");
                  }}
                >
                  {translations.configure}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="">{translations.emailNotifications.label}</p>
                  <p className="text-sm">
                    {translations.emailNotifications.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Configure email notification settings");
                  }}
                >
                  {translations.configure}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
