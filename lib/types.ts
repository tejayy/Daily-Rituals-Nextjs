export type Category = 'health' | 'learning' | 'productivity' | 'wellness' | 'creativity' | 'relationships';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: Category;
  frequency: 'daily' | 'weekly';
  target: number; // days per week for weekly, 1 for daily
  createdAt: string;
  color: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number; // percentage
  lastCompletedDate?: string;
}

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  health: { label: 'Health & Fitness', color: '#EF4444' },
  learning: { label: 'Learning', color: '#3B82F6' },
  productivity: { label: 'Productivity', color: '#8B5CF6' },
  wellness: { label: 'Wellness', color: '#06B6D4' },
  creativity: { label: 'Creativity', color: '#F59E0B' },
  relationships: { label: 'Relationships', color: '#EC4899' },
};
