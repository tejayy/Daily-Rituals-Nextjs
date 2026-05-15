"use client";

import { useRouter } from "next/navigation";
import { useHabits } from "@/lib/context";
import { HabitAnalytics } from "@/components/habit-analytics";
import { StatsOverview } from "@/components/stats-overview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const { habits, stats } = useHabits();

  // Calculate overall statistics
  const totalStreak = habits.reduce(
    (sum, habit) => sum + (stats[habit.id]?.currentStreak || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Analytics & Insights
          </h1>
          <p className="text-lg text-neutral-600">
            Deep dive into your habit patterns and progress over time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <StatsOverview />
        </div>

        {/* Quick Summary */}
        {habits.length > 0 && (
          <Card className="p-6 border-neutral-200 mb-12 bg-white">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Quick Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500 font-medium">
                  Total Active Streaks
                </p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {totalStreak}
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500 font-medium">
                  Average Completion Rate
                </p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {Math.round(
                    habits.reduce(
                      (sum, habit) =>
                        sum + (stats[habit.id]?.completionRate || 0),
                      0,
                    ) / habits.length,
                  )}
                  %
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500 font-medium">
                  Total Times Completed
                </p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {habits.reduce(
                    (sum, habit) =>
                      sum + (stats[habit.id]?.totalCompleted || 0),
                    0,
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Detailed Analytics */}
        <HabitAnalytics />
      </div>
    </main>
  );
}
