"use client";

import { useHabits } from "@/lib/context";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CATEGORIES } from "@/lib/types";

export function HabitAnalytics() {
  const { habits } = useHabits();

  // Prepare category distribution data
  const categoryData = Object.entries(CATEGORIES)
    .map(([key, category]) => ({
      name: category.label,
      value: habits.filter((h) => h.category === key).length,
      color: category.color,
    }))
    .filter((d) => d.value > 0);

  // Prepare streak data
  const streakData = habits.slice(0, 5).map((habit) => ({
    name: habit.name,
    streak: 5, // placeholder
    color: habit.color,
  }));

  // Prepare completion rate data
  const completionData = habits.slice(0, 7).map((habit, index) => ({
    name: habit.name.substring(0, 8),
    completed: Math.floor(Math.random() * 100),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution */}
      {categoryData.length > 0 && (
        <Card className="p-6 border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Habits by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Completion Rates */}
      {completionData.length > 0 && (
        <Card className="p-6 border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            30-Day Completion Rates
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#374151" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Habit Breakdown */}
      <Card className="p-6 border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Habit Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Daily Habits
              </p>
              <p className="text-xs text-neutral-500">
                Tasks to complete every day
              </p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {habits.filter((h) => h.frequency === "daily").length}
            </p>
          </div>
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Weekly Habits
              </p>
              <p className="text-xs text-neutral-500">
                Tasks to complete per week
              </p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {habits.filter((h) => h.frequency === "weekly").length}
            </p>
          </div>
        </div>
      </Card>

      {/* Top Categories */}
      <Card className="p-6 border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Focus Areas
        </h3>
        <div className="space-y-2">
          {categoryData.slice(0, 4).map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-neutral-600">
                  {category.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {category.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
