"use client";

import { Habit, HabitStats, CATEGORIES } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface HabitDetailsProps {
  habit: Habit;
  stats: HabitStats;
}

export function HabitDetails({ habit, stats }: HabitDetailsProps) {
  const category = CATEGORIES[habit.category];
  const createdDaysAgo = Math.floor(
    (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <Card className="p-6 border-neutral-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <h2 className="text-2xl font-bold text-neutral-900">
                {habit.name}
              </h2>
            </div>
            <Badge className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200">
              {category.label}
            </Badge>
          </div>
        </div>

        {habit.description && (
          <p className="text-neutral-600 text-sm mb-4">{habit.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-neutral-50 p-3 rounded-lg">
            <p className="text-neutral-500 text-xs font-medium">FREQUENCY</p>
            <p className="text-neutral-900 font-semibold mt-1">
              {habit.frequency === "daily"
                ? "Every Day"
                : `${habit.target}x per Week`}
            </p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg">
            <p className="text-neutral-500 text-xs font-medium">STARTED</p>
            <p className="text-neutral-900 font-semibold mt-1">
              {createdDaysAgo} days ago
            </p>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Card className="p-6 border-neutral-200">
        <h3 className="font-semibold text-neutral-900 mb-4">Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-l-2 border-neutral-900 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-medium text-neutral-500">
                CURRENT STREAK
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {stats.currentStreak}
            </p>
            <p className="text-xs text-neutral-500 mt-1">days</p>
          </div>

          <div className="border-l-2 border-blue-500 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-medium text-neutral-500">
                LONGEST STREAK
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {stats.longestStreak}
            </p>
            <p className="text-xs text-neutral-500 mt-1">days</p>
          </div>

          <div className="border-l-2 border-green-500 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs font-medium text-neutral-500">
                COMPLETION RATE
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {stats.completionRate}%
            </p>
            <p className="text-xs text-neutral-500 mt-1">30-day average</p>
          </div>

          <div className="border-l-2 border-purple-500 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-medium text-neutral-500">
                TOTAL COMPLETED
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {stats.totalCompleted}
            </p>
            <p className="text-xs text-neutral-500 mt-1">times</p>
          </div>
        </div>

        {stats.lastCompletedDate && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Last completed on{" "}
              <span className="font-semibold text-neutral-900">
                {format(new Date(stats.lastCompletedDate), "MMM d, yyyy")}
              </span>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
