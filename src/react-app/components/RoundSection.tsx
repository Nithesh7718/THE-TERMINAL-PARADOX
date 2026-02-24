import { cn } from "@/react-app/lib/utils";
import DoorCard from "./DoorCard";
import { Code2, Bug, FileQuestion } from "lucide-react";

interface Door {
  number: number;
  title: string;
  description: string;
  status: "available" | "locked" | "completed" | "selected";
}

interface RoundSectionProps {
  roundNumber: 1 | 2 | 3;
  title: string;
  subtitle: string;
  doors: Door[];
  isActive: boolean;
  onDoorSelect?: (doorNumber: number) => void;
}

const roundIcons = {
  1: FileQuestion,
  2: Bug,
  3: Code2,
};

const roundColors = {
  1: "from-chart-3/20 to-transparent border-chart-3/30",
  2: "from-chart-4/20 to-transparent border-chart-4/30",
  3: "from-chart-5/20 to-transparent border-chart-5/30",
};

const roundAccents = {
  1: "text-chart-3",
  2: "text-chart-4",
  3: "text-chart-5",
};

export default function RoundSection({
  roundNumber,
  title,
  subtitle,
  doors,
  isActive,
  onDoorSelect,
}: RoundSectionProps) {
  const Icon = roundIcons[roundNumber];

  return (
    <section
      className={cn(
        "relative rounded-3xl p-8 transition-all duration-500",
        "border bg-gradient-to-b",
        roundColors[roundNumber],
        !isActive && "opacity-40 pointer-events-none"
      )}
    >
      {/* Round header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-card to-secondary",
            "border border-border"
          )}
        >
          <Icon className={cn("w-7 h-7", roundAccents[roundNumber])} />
        </div>
        <div>
          <div
            className={cn(
              "text-sm font-semibold uppercase tracking-wider mb-1",
              roundAccents[roundNumber]
            )}
          >
            Round {roundNumber}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Doors grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doors.map((door) => (
          <DoorCard
            key={door.number}
            doorNumber={door.number}
            title={door.title}
            description={door.description}
            status={door.status}
            onClick={() => onDoorSelect?.(door.number)}
          />
        ))}
      </div>
    </section>
  );
}
