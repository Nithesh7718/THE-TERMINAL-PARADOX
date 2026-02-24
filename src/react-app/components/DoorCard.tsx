import { DoorOpen, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface DoorCardProps {
  doorNumber: number;
  title: string;
  description: string;
  status: "available" | "locked" | "completed" | "selected";
  onClick?: () => void;
}

export default function DoorCard({
  doorNumber,
  title,
  description,
  status,
  onClick,
}: DoorCardProps) {
  const isClickable = status === "available";

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        "group relative w-full rounded-2xl p-6 transition-all duration-500",
        "border-2 backdrop-blur-sm",
        "flex flex-col items-center text-center gap-4",
        "min-h-[280px]",
        status === "available" && [
          "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent",
          "hover:border-primary hover:shadow-[0_0_40px_rgba(45,212,191,0.3)]",
          "hover:scale-105 cursor-pointer",
        ],
        status === "locked" && [
          "border-border/30 bg-secondary/30 opacity-60 cursor-not-allowed",
        ],
        status === "completed" && [
          "border-chart-1/50 bg-gradient-to-b from-chart-1/10 to-transparent",
        ],
        status === "selected" && [
          "border-accent bg-gradient-to-b from-accent/20 to-transparent",
          "shadow-[0_0_30px_rgba(139,92,246,0.4)]",
        ]
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-b from-primary/20 via-transparent to-transparent",
          status === "available" && "group-hover:opacity-100"
        )}
      />

      {/* Door icon container */}
      <div
        className={cn(
          "relative w-24 h-32 rounded-t-[40px] rounded-b-lg",
          "border-2 flex items-center justify-center",
          "transition-all duration-500",
          status === "available" && [
            "border-primary/60 bg-gradient-to-b from-primary/20 to-primary/5",
            "group-hover:border-primary group-hover:shadow-[inset_0_0_20px_rgba(45,212,191,0.2)]",
          ],
          status === "locked" && "border-muted-foreground/30 bg-secondary/50",
          status === "completed" && "border-chart-1/60 bg-chart-1/10",
          status === "selected" && "border-accent bg-accent/20"
        )}
      >
        {/* Door handle */}
        <div
          className={cn(
            "absolute right-3 top-1/2 w-2 h-6 rounded-full",
            status === "available" && "bg-primary/60 group-hover:bg-primary",
            status === "locked" && "bg-muted-foreground/30",
            status === "completed" && "bg-chart-1/60",
            status === "selected" && "bg-accent"
          )}
        />

        {/* Status icon */}
        {status === "locked" && (
          <Lock className="w-8 h-8 text-muted-foreground/50" />
        )}
        {status === "completed" && (
          <CheckCircle2 className="w-8 h-8 text-chart-1" />
        )}
        {status === "available" && (
          <DoorOpen className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
        )}
        {status === "selected" && (
          <DoorOpen className="w-8 h-8 text-accent animate-pulse" />
        )}
      </div>

      {/* Door number badge */}
      <div
        className={cn(
          "absolute top-4 right-4 w-8 h-8 rounded-full",
          "flex items-center justify-center text-sm font-bold",
          status === "available" && "bg-primary/20 text-primary",
          status === "locked" && "bg-muted text-muted-foreground",
          status === "completed" && "bg-chart-1/20 text-chart-1",
          status === "selected" && "bg-accent/20 text-accent"
        )}
      >
        {doorNumber}
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <h3
          className={cn(
            "text-xl font-bold",
            status === "available" && "text-foreground group-hover:text-primary",
            status === "locked" && "text-muted-foreground",
            status === "completed" && "text-chart-1",
            status === "selected" && "text-accent"
          )}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Status label */}
      <div
        className={cn(
          "mt-auto px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider",
          status === "available" && "bg-primary/20 text-primary",
          status === "locked" && "bg-muted text-muted-foreground",
          status === "completed" && "bg-chart-1/20 text-chart-1",
          status === "selected" && "bg-accent/20 text-accent"
        )}
      >
        {status === "available" && "Enter"}
        {status === "locked" && "Locked"}
        {status === "completed" && "Completed"}
        {status === "selected" && "In Progress"}
      </div>
    </button>
  );
}
