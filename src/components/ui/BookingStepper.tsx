import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  label: string;
  icon?: React.ReactNode;
}

interface BookingStepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  className?: string;
}

export default function BookingStepper({ steps, currentStep, className }: BookingStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shrink-0",
                    isDone && "bg-primary text-primary-foreground shadow-gold",
                    isActive && "bg-primary/20 text-primary border-2 border-primary shadow-glow-gold animate-pulse-gold",
                    !isDone && !isActive && "bg-muted/50 text-muted-foreground border border-border/50"
                  )}
                >
                  {isDone ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs lg:text-sm font-medium whitespace-nowrap transition-colors",
                    isDone && "text-primary",
                    isActive && "text-foreground font-semibold",
                    !isDone && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-3 mt-[-1.5rem]">
                  <div className="h-0.5 w-full bg-border/50 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-primary rounded-full transition-all duration-700",
                        isDone ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
