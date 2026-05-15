"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center border-neutral-200">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-neutral-100 rounded-full">
          <Lightbulb className="w-6 h-6 text-neutral-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-neutral-900 text-white hover:bg-neutral-800"
        >
          {action.label}
        </Button>
      )}
    </Card>
  );
}
