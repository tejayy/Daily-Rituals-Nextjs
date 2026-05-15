"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Habit, CATEGORIES, Category } from "@/lib/types";
import { useHabits } from "@/lib/context";

interface HabitFormProps {
  onSuccess?: () => void;
  initialHabit?: Habit;
}

export function HabitForm({ onSuccess, initialHabit }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(initialHabit?.name || "");
  const [description, setDescription] = useState(
    initialHabit?.description || "",
  );
  const [category, setCategory] = useState<Category>(
    initialHabit?.category || "health",
  );
  const [frequency, setFrequency] = useState<"daily" | "weekly">(
    initialHabit?.frequency || "daily",
  );
  const [target, setTarget] = useState(initialHabit?.target.toString() || "1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    if (initialHabit) {
      updateHabit(initialHabit.id, {
        name,
        description,
        category,
        frequency: frequency as "daily" | "weekly",
        target: parseInt(target),
      });
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        description,
        category,
        frequency: frequency as "daily" | "weekly",
        target: parseInt(target),
        createdAt: new Date().toISOString(),
        color: CATEGORIES[category].color,
      };
      addHabit(newHabit);
    }

    setName("");
    setDescription("");
    setCategory("health");
    setFrequency("daily");
    setTarget("1");
    onSuccess?.();
  };

  return (
    <Card className="p-6 border-neutral-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="name"
            className="text-sm font-medium text-neutral-700"
          >
            Habit Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Exercise"
            className="mt-2 border-neutral-200"
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-neutral-700"
          >
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this habit matters to you..."
            className="mt-2 border-neutral-200 resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="category"
              className="text-sm font-medium text-neutral-700"
            >
              Category
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full mt-2 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label
              htmlFor="frequency"
              className="text-sm font-medium text-neutral-700"
            >
              Frequency
            </Label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as "daily" | "weekly")
              }
              className="w-full mt-2 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {frequency === "weekly" && (
          <div>
            <Label
              htmlFor="target"
              className="text-sm font-medium text-neutral-700"
            >
              Times per Week
            </Label>
            <select
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800"
          >
            {initialHabit ? "Update Habit" : "Create Habit"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
