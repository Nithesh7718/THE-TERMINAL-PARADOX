import { cn } from "@/react-app/lib/utils";
import { Check, X } from "lucide-react";

interface QuizOptionProps {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function QuizOption({
  label,
  text,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled,
}: QuizOptionProps) {
  const showCorrect = isRevealed && isCorrect;
  const showIncorrect = isRevealed && isSelected && !isCorrect;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
        "flex items-center gap-4 group",
        !isRevealed && !isSelected && [
          "border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5",
        ],
        !isRevealed && isSelected && [
          "border-primary bg-primary/10 shadow-[0_0_15px_rgba(45,212,191,0.2)]",
        ],
        showCorrect && [
          "border-chart-1 bg-chart-1/10",
        ],
        showIncorrect && [
          "border-destructive bg-destructive/10",
        ],
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {/* Option label (A, B, C, D) */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg",
          "transition-all duration-200",
          !isRevealed && !isSelected && [
            "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
          ],
          !isRevealed && isSelected && [
            "bg-primary text-primary-foreground",
          ],
          showCorrect && "bg-chart-1 text-primary-foreground",
          showIncorrect && "bg-destructive text-destructive-foreground"
        )}
      >
        {showCorrect ? (
          <Check className="w-5 h-5" />
        ) : showIncorrect ? (
          <X className="w-5 h-5" />
        ) : (
          label
        )}
      </div>

      {/* Option text */}
      <span
        className={cn(
          "flex-1 font-medium",
          !isRevealed && isSelected && "text-primary",
          showCorrect && "text-chart-1",
          showIncorrect && "text-destructive"
        )}
      >
        {text}
      </span>
    </button>
  );
}
