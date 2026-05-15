"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Habit, HabitLog, HabitStats } from "./types";
import { storage } from "./storage";

interface HabitContextType {
  habits: Habit[];
  logs: HabitLog[];
  stats: Record<string, HabitStats>;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logHabit: (habitId: string, date: string, completed: boolean) => void;
  getHabitStats: (habitId: string) => HabitStats;
  getTodayLogs: () => HabitLog[];
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [stats, setStats] = useState<Record<string, HabitStats>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedHabits = storage.getHabits();
    const loadedLogs = storage.getLogs();
    setHabits(loadedHabits);
    setLogs(loadedLogs);

    // Calculate stats for all habits
    const newStats: Record<string, HabitStats> = {};
    loadedHabits.forEach((habit) => {
      newStats[habit.id] = storage.calculateStats(habit.id);
    });
    setStats(newStats);
    setIsLoaded(true);
  }, []);

  const addHabit = (habit: Habit) => {
    storage.addHabit(habit);
    setHabits((prev) => [...prev, habit]);
    setStats((prev) => ({
      ...prev,
      [habit.id]: storage.calculateStats(habit.id),
    }));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    storage.updateHabit(id, updates);
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    );
  };

  const deleteHabit = (id: string) => {
    storage.deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLogs((prev) => prev.filter((l) => l.habitId !== id));
    setStats((prev) => {
      const newStats = { ...prev };
      delete newStats[id];
      return newStats;
    });
  };

  const logHabit = (habitId: string, date: string, completed: boolean) => {
    storage.logHabit(habitId, date, completed);
    const newLog = { habitId, date, completed };

    setLogs((prev) => {
      const existing = prev.find(
        (l) => l.habitId === habitId && l.date === date,
      );
      if (existing) {
        return prev.map((l) =>
          l.habitId === habitId && l.date === date ? newLog : l,
        );
      }
      return [...prev, newLog];
    });

    // Recalculate stats for this habit
    const newStats = storage.calculateStats(habitId);
    setStats((prev) => ({
      ...prev,
      [habitId]: newStats,
    }));
  };

  const getHabitStats = (habitId: string): HabitStats => {
    return stats[habitId] || storage.calculateStats(habitId);
  };

  const getTodayLogs = (): HabitLog[] => {
    const today = new Date().toISOString().split("T")[0];
    return logs.filter((l) => l.date === today && l.completed);
  };

  if (!isLoaded) {
    return <div>{children}</div>;
  }

  return (
    <HabitContext.Provider
      value={{
        habits,
        logs,
        stats,
        addHabit,
        updateHabit,
        deleteHabit,
        logHabit,
        getHabitStats,
        getTodayLogs,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
