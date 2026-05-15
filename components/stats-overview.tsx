"use client";

import { Card } from "@/components/ui/card";
import { useHabits } from "@/lib/context";
import { Flame, Target, TrendingUp, CheckCircle2 } from "lucide-react";

export function StatsOverview() {
  const { habits, stats: habitStats, getTodayLogs } = useHabits();
  const todayCompleted = getTodayLogs();

  const longestStreak =
    habits.length > 0
      ? Math.max(...habits.map((h) => habitStats[h.id]?.longestStreak || 0), 0)
      : 0;

  const completionRate =
    habits.length > 0
      ? Math.round((todayCompleted.length / habits.length) * 100)
      : 0;

  const stats = [
    {
      label: "Active Habits",
      value: habits.length,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Today Completed",
      value: todayCompleted.length,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4 border-neutral-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
