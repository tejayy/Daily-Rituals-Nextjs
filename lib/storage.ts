import { Habit, HabitLog, HabitStats } from './types';

const HABITS_KEY = 'growth_habits';
const LOGS_KEY = 'growth_habit_logs';

export const storage = {
  // Habit operations
  getHabits: (): Habit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addHabit: (habit: Habit): void => {
    if (typeof window === 'undefined') return;
    const habits = storage.getHabits();
    habits.push(habit);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  updateHabit: (id: string, updates: Partial<Habit>): void => {
    if (typeof window === 'undefined') return;
    const habits = storage.getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    }
  },

  deleteHabit: (id: string): void => {
    if (typeof window === 'undefined') return;
    const habits = storage.getHabits().filter(h => h.id !== id);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    // Also delete all logs for this habit
    const logs = storage.getLogs();
    const filtered = logs.filter(l => l.habitId !== id);
    localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));
  },

  // Log operations
  getLogs: (): HabitLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  logHabit: (habitId: string, date: string, completed: boolean): void => {
    if (typeof window === 'undefined') return;
    const logs = storage.getLogs();
    const existingIndex = logs.findIndex(
      l => l.habitId === habitId && l.date === date
    );

    if (existingIndex !== -1) {
      logs[existingIndex].completed = completed;
    } else {
      logs.push({ habitId, date, completed });
    }
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  getLogsByHabit: (habitId: string): HabitLog[] => {
    const logs = storage.getLogs();
    return logs.filter(l => l.habitId === habitId);
  },

  getLogsByDate: (date: string): HabitLog[] => {
    const logs = storage.getLogs();
    return logs.filter(l => l.date === date && l.completed);
  },

  // Stats operations
  calculateStats: (habitId: string): HabitStats => {
    const logs = storage.getLogsByHabit(habitId);
    const sortedLogs = logs.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const completedLogs = sortedLogs.filter(l => l.completed);
    const totalCompleted = completedLogs.length;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      if (
        logDate.getTime() === checkDate.getTime() &&
        log.completed
      ) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (logDate.getTime() < checkDate.getTime()) {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const log of sortedLogs) {
      if (log.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate completion rate
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = logs.filter(
      l => new Date(l.date) >= thirtyDaysAgo
    );
    const completionRate =
      recentLogs.length > 0
        ? Math.round(
            (recentLogs.filter(l => l.completed).length / recentLogs.length) * 100
          )
        : 0;

    const lastCompletedLog = completedLogs[0];

    return {
      habitId,
      currentStreak,
      longestStreak,
      totalCompleted,
      completionRate,
      lastCompletedDate: lastCompletedLog?.date,
    };
  },
};
