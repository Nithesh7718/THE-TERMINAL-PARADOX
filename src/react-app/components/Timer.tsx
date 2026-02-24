import { useEffect, useState } from "react";
import { Timer as TimerIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function Timer({ initialMinutes, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 60;
  const isCritical = timeLeft <= 30;

  const percentage = (timeLeft / (initialMinutes * 60)) * 100;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-sm",
        "transition-all duration-300",
        isCritical
          ? "bg-destructive/20 border-destructive/50 animate-pulse"
          : isLowTime
          ? "bg-chart-3/20 border-chart-3/50"
          : "bg-card/80 border-border"
      )}
    >
      {isCritical ? (
        <AlertTriangle className="w-5 h-5 text-destructive animate-bounce" />
      ) : (
        <TimerIcon
          className={cn(
            "w-5 h-5",
            isLowTime ? "text-chart-3" : "text-primary"
          )}
        />
      )}

      <div className="flex flex-col">
        <span
          className={cn(
            "text-2xl font-mono font-bold tabular-nums",
            isCritical
              ? "text-destructive"
              : isLowTime
              ? "text-chart-3"
              : "text-foreground"
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isCritical
                ? "bg-destructive"
                : isLowTime
                ? "bg-chart-3"
                : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
