"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/lib/context";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";

export function DailyTracker() {
  const { habits, logs, logHabit } = useHabits();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const getCompletedHabits = () => {
    return logs.filter((l) => l.date === selectedDate && l.completed);
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const completedCount = getCompletedHabits().length;
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="p-6 border-neutral-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousDay}
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-neutral-900">
              {formattedDate}
            </h3>
            {!isToday && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToday}
                className="text-xs text-neutral-500 hover:text-neutral-700 mt-1"
              >
                Back to Today
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextDay}
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-neutral-100 p-4 rounded-lg">
          <p className="text-sm text-neutral-600">
            {completedCount} of {habits.length} habits completed
          </p>
          <div className="w-full bg-neutral-200 rounded-full h-2 mt-3">
            <div
              className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
              style={{
                width:
                  habits.length > 0
                    ? `${(completedCount / habits.length) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {habits.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">No habits yet</p>
        ) : (
          habits.map((habit) => {
            const log = logs.find(
              (l) => l.habitId === habit.id && l.date === selectedDate,
            );
            const completed = log?.completed || false;

            return (
              <button
                key={habit.id}
                onClick={() => logHabit(habit.id, selectedDate, !completed)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left"
              >
                {completed ? (
                  <CheckCircle2 className="w-5 h-5 text-neutral-900 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      completed
                        ? "text-neutral-500 line-through"
                        : "text-neutral-900"
                    }`}
                  >
                    {habit.name}
                  </p>
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: habit.color }}
                />
              </button>
            );
          })
        )}
      </div>
    </Card>
  );
}
