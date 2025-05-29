"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

interface Props {
  healthScore: number;
  metrics: HealthMetric[];
  className?: string;
}

export const DashboardOverviewCard = ({
  healthScore,
  metrics,
  className
}: Props) => {
  const scoreColor = useMemo(() => {
    if (healthScore >= 80) return "text-green-500";
    if (healthScore >= 60) return "text-yellow-500";
    return "text-red-500";
  }, [healthScore]);

  const scoreSize = useMemo(() => {
    return Math.min(Math.max(healthScore, 0), 100);
  }, [healthScore]);

  return (
    <div 
      className={cn(
        "p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm",
        "border border-gray-100 dark:border-gray-700",
        className
      )}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sağlık Özeti
          </h2>
          <time 
            className="text-sm text-gray-500 dark:text-gray-400"
            dateTime={new Date().toISOString()}
          >
            Güncel
          </time>
        </div>

        {/* Health Score */}
        <div className="flex items-center justify-center">
          <motion.div 
            className="relative w-32 h-32"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="10"
              />
              {/* Score circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                className={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${scoreSize * 2.83} 283`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${scoreSize * 2.83} 283` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-3xl font-bold", scoreColor)}>
                {healthScore}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div 
          className="grid grid-cols-2 gap-4"
          role="list"
          aria-label="Sağlık metrikleri"
        >
          {metrics.map((metric) => (
            <div
              key={metric.id}
              role="listitem"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {metric.value}
                    <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                      {metric.unit}
                    </span>
                  </p>
                </div>
                <div 
                  className={cn(
                    "p-1.5 rounded-full",
                    metric.trend === "up" && "bg-green-100 dark:bg-green-900",
                    metric.trend === "down" && "bg-red-100 dark:bg-red-900",
                    metric.trend === "stable" && "bg-blue-100 dark:bg-blue-900"
                  )}
                >
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ 
                      y: metric.trend === "up" ? -2 : 
                         metric.trend === "down" ? 2 : 0 
                    }}
                    transition={{ 
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1
                    }}
                  >
                    {metric.trend === "up" && (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 14l5-5 5 5H7z" />
                      </svg>
                    )}
                    {metric.trend === "down" && (
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                      </svg>
                    )}
                    {metric.trend === "stable" && (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5 12h14" />
                      </svg>
                    )}
                  </motion.div>
                </div>
              </div>
              <p 
                className="mt-2 text-xs text-gray-500 dark:text-gray-400"
                title={`Son güncelleme: ${metric.lastUpdated}`}
              >
                {metric.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 