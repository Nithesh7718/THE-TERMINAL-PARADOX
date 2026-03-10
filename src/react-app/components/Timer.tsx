import { useEffect, useState, useRef } from "react";
import { Timer as TimerIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  /** Unique key so each round/door gets its own persisted start time */
  storageKey?: string;
}

export default function Timer({
  initialMinutes,
  onTimeUp,
  isPaused = false,
  storageKey = "timer_default",
}: TimerProps) {
  const totalSeconds = initialMinutes * 60;

  // On first mount, calculate remaining seconds from persisted start time
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem(`timer_start_${storageKey}`);
      if (stored) {
        const elapsed = Math.floor((Date.now() - parseInt(stored, 10)) / 1000);
        const remaining = totalSeconds - elapsed;
        if (remaining <= 0) return 0;
        return remaining;
      }
    } catch { /* ignore */ }
    // First time — record the start
    try {
      sessionStorage.setItem(`timer_start_${storageKey}`, Date.now().toString());
    } catch { /* ignore */ }
    return totalSeconds;
  });

  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Fire time-up immediately if we resumed into an already-expired timer
  const firedRef = useRef(false);
  useEffect(() => {
    if (timeLeft <= 0 && !firedRef.current) {
      firedRef.current = true;
      onTimeUpRef.current();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!firedRef.current) {
            firedRef.current = true;
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 300;   // 5 min
  const isCritical = timeLeft <= 60;   // 1 min
  const percentage = (timeLeft / totalSeconds) * 100;

  const progressBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${percentage}%`;
    }
  }, [percentage]);

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
          className={cn("w-5 h-5", isLowTime ? "text-chart-3" : "text-primary")}
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
            ref={progressBarRef}
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isCritical
                ? "bg-destructive"
                : isLowTime
                  ? "bg-chart-3"
                  : "bg-primary"
            )}
          />
        </div>
      </div>
    </div>
  );
}
