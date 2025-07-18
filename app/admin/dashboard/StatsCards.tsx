// components/dashboard/StatsCards.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, DollarSign, TrendingUp } from "lucide-react";

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

export function StatsCards({ stats }: { stats: any[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div key={index} variants={fadeInUp}>
          <Card className="">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium ">{stat.label}</p>
                  <p className="md:text-3xl text-xl font-bold ">{stat.value}</p>
                  <p className="text-sm text-[#547455]">
                    {stat.change} {stat.changeFromLastMonth}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-[#efefef] ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
