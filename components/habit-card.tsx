"use client";

import { Habit, HabitStats } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/lib/context";
import { Check, Trash2, Edit2 } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  todayCompleted: boolean;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({
  habit,
  stats,
  todayCompleted,
  onEdit,
}: HabitCardProps) {
  const { logHabit, deleteHabit } = useHabits();
  const today = new Date().toISOString().split("T")[0];

  const handleToggleToday = () => {
    logHabit(habit.id, today, !todayCompleted);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${habit.name}"?`)) {
      deleteHabit(habit.id);
    }
  };

  return (
    <Card className="p-4 border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <h3 className="font-semibold text-neutral-900">{habit.name}</h3>
            </div>
            {habit.description && (
              <p className="text-sm text-neutral-500 mt-1">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-neutral-50 p-3 rounded-lg">
            <div className="text-neutral-500 text-xs font-medium">STREAK</div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.currentStreak}
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg">
            <div className="text-neutral-500 text-xs font-medium">
              COMPLETION
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.completionRate}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-neutral-500">
            {habit.frequency === "daily"
              ? "Daily"
              : `${habit.target}x per week`}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-neutral-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleToggleToday}
          className={`w-full h-10 transition-all ${
            todayCompleted
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          }`}
        >
          {todayCompleted ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Completed Today
            </>
          ) : (
            "Mark Complete"
          )}
        </Button>
      </div>
    </Card>
  );
}
