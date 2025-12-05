// components/dashboard/StatsCards.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Banknote, TrendingUp, RefreshCw } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function StatsCards({
  stats,
  isLoading,
  lastRefreshTime,
  onRefresh,
  translations,
}: {
  stats: any[];
  isLoading?: boolean;
  lastRefreshTime?: Date;
  onRefresh?: () => void;
  translations?: any;
}) {
  console.log("🚀 ~ StatsCards ~ stats:", stats);

  const formatRefreshTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div className="mb-8">
      {/* Refresh Status */}
      {lastRefreshTime && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {translations?.lastUpdated || "Last updated"}:{" "}
            {formatRefreshTime(lastRefreshTime)}
          </p>
          <div className="flex items-center gap-3">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading
                  ? translations?.refreshing || "Refreshing..."
                  : translations?.refresh || "Refresh"}
              </Button>
            )}
          </div>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className={`${isLoading ? "opacity-75" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium ">{stat.label}</p>
                    <p className="md:text-3xl text-xl font-bold flex items-center gap-1">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                      ) : (
                        <>
                          {stat.showCurrencyIcon && (
                            <span className="text-lg">₾</span>
                          )}
                          {stat.value}
                        </>
                      )}
                    </p>
                    <p className="text-sm text-[#547455]">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      ) : (
                        `${stat.change} ${stat.changeFromLastMonth}`
                      )}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-[#efefef] ${stat.color} ${
                      isLoading ? "animate-pulse" : ""
                    }`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
