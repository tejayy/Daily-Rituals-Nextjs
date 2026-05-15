"use client";

import { useState } from "react";
import { useHabits } from "@/lib/context";
import { Habit } from "@/lib/types";
import { HabitCard } from "@/components/habit-card";
import { StatsOverview } from "@/components/stats-overview";
import { HabitForm } from "@/components/habit-form";
import { DailyTracker } from "@/components/daily-tracker";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { habits, logs, stats, getTodayLogs } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredHabits = selectedCategory
    ? habits.filter((h) => h.category === selectedCategory)
    : habits;

  const displayHabits = editingHabit
    ? habits.filter((h) => h.id === editingHabit.id)
    : filteredHabits;

  const today = new Date().toISOString().split("T")[0];

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 bg-gradient-to-r from-neutral-50 to-white p-8 rounded-xl border border-neutral-200">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Personal Growth System
          </h1>
          <p className="text-lg text-neutral-600 mb-4">
            Build better habits and track your progress toward your goals
          </p>
          <div className="flex gap-4 text-sm text-neutral-600">
            <div>
              <span className="font-semibold text-neutral-900">
                {habits.length}
              </span>{" "}
              habits created
            </div>
            <div>•</div>
            <div>
              <span className="font-semibold text-neutral-900">
                {getTodayLogs().length}
              </span>{" "}
              completed today
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <StatsOverview />
        </div>

        {/* Analytics Link */}
        {habits.length > 0 && (
          <div className="mb-12 text-center">
            <Link href="/analytics">
              <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
            </Link>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Daily Tracker */}
              <DailyTracker />

              {/* Add New Habit */}
              <Button
                onClick={() => {
                  setEditingHabit(null);
                  setShowForm(!showForm);
                }}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-11"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? "Cancel" : "New Habit"}
              </Button>

              {/* Habit Form */}
              {showForm && (
                <HabitForm
                  onSuccess={handleFormSuccess}
                  initialHabit={editingHabit || undefined}
                />
              )}

              {/* Category Filter */}
              <Card className="p-4 border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3 text-sm">
                  FILTER BY CATEGORY
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      !selectedCategory
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    All Habits
                  </button>
                  {[
                    "health",
                    "learning",
                    "productivity",
                    "wellness",
                    "creativity",
                    "relationships",
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        selectedCategory === category
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Habits Grid */}
          <div className="lg:col-span-2">
            {displayHabits.length === 0 ? (
              <EmptyState
                title={showForm ? "Create Your First Habit" : "No Habits Yet"}
                description={
                  showForm
                    ? "Fill in the form on the left to create your first habit and start your personal growth journey."
                    : "Create your first habit to begin tracking your personal growth. Start small and build momentum!"
                }
                action={
                  !showForm
                    ? {
                        label: "Create First Habit",
                        onClick: () => setShowForm(true),
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayHabits.map((habit) => {
                  const habitStats = stats[habit.id] || {
                    habitId: habit.id,
                    currentStreak: 0,
                    longestStreak: 0,
                    totalCompleted: 0,
                    completionRate: 0,
                  };

                  const todayLog = logs.find(
                    (l) => l.habitId === habit.id && l.date === today,
                  );

                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      stats={habitStats}
                      todayCompleted={todayLog?.completed || false}
                      onEdit={handleEdit}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
