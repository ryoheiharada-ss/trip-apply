"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { useProgressStore } from "@/store/progress"

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const { progress, setProgress } = useProgressStore();
  const targetProgress = (step / totalSteps) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetProgress, setProgress]);

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full transition-all duration-500" />
      <p className="text-sm text-muted-foreground text-right">
        Step {step} of {totalSteps}
      </p>
    </div>
  );
}
