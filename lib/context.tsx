"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
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

  // Load localStorage data
  useEffect(() => {
    const loadedHabits = storage.getHabits();
    const loadedLogs = storage.getLogs();

    const calculatedStats: Record<string, HabitStats> = {};

    loadedHabits.forEach((habit) => {
      calculatedStats[habit.id] = storage.calculateStats(habit.id);
    });

    setHabits(loadedHabits);
    setLogs(loadedLogs);
    setStats(calculatedStats);
    setIsLoaded(true);
  }, []);

  // Add Habit
  const addHabit = (habit: Habit) => {
    storage.addHabit(habit);

    setHabits((prev) => [...prev, habit]);

    setStats((prev) => ({
      ...prev,
      [habit.id]: storage.calculateStats(habit.id),
    }));
  };

  // Update Habit
  const updateHabit = (id: string, updates: Partial<Habit>) => {
    storage.updateHabit(id, updates);

    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit)),
    );
  };

  // Delete Habit
  const deleteHabit = (id: string) => {
    storage.deleteHabit(id);

    setHabits((prev) => prev.filter((habit) => habit.id !== id));

    setLogs((prev) => prev.filter((log) => log.habitId !== id));

    setStats((prev) => {
      const updatedStats = { ...prev };

      delete updatedStats[id];

      return updatedStats;
    });
  };

  // Log Habit
  const logHabit = (habitId: string, date: string, completed: boolean) => {
    storage.logHabit(habitId, date, completed);

    const newLog: HabitLog = {
      habitId,
      date,
      completed,
    };

    setLogs((prev) => {
      const existingLog = prev.find(
        (log) => log.habitId === habitId && log.date === date,
      );

      if (existingLog) {
        return prev.map((log) =>
          log.habitId === habitId && log.date === date ? newLog : log,
        );
      }

      return [...prev, newLog];
    });

    setStats((prev) => ({
      ...prev,
      [habitId]: storage.calculateStats(habitId),
    }));
  };

  // Get habit stats
  const getHabitStats = (habitId: string): HabitStats => {
    return stats[habitId] || storage.calculateStats(habitId);
  };

  // Get today's logs
  const getTodayLogs = (): HabitLog[] => {
    const today = new Date().toISOString().split("T")[0];

    return logs.filter((log) => log.date === today && log.completed);
  };

  // Memoized context value
  const value = useMemo(
    () => ({
      habits,
      logs,
      stats,
      addHabit,
      updateHabit,
      deleteHabit,
      logHabit,
      getHabitStats,
      getTodayLogs,
    }),
    [habits, logs, stats],
  );

  // Prevent hydration mismatch
  if (!isLoaded) {
    return null;
  }

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }

  return context;
}
