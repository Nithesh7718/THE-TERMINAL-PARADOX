import { cn } from "@/react-app/lib/utils";

export type Language = "python" | "java" | "c" | "cpp" | "javascript";

interface LanguageSelectorProps {
  selected: Language | null;
  onSelect: (language: Language) => void;
  disabled?: boolean;
}

const languages: { id: Language; name: string; icon: string }[] = [
  { id: "python", name: "Python", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "c", name: "C", icon: "🔷" },
  { id: "cpp", name: "C++", icon: "⚡" },
  { id: "javascript", name: "JavaScript", icon: "🟨" },
];

export default function LanguageSelector({
  selected,
  onSelect,
  disabled,
}: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onSelect(lang.id)}
          disabled={disabled}
          className={cn(
            "p-4 rounded-xl border-2 transition-all duration-200",
            "flex flex-col items-center gap-2",
            "hover:scale-105",
            selected === lang.id
              ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
              : "border-border bg-card/50 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed hover:scale-100"
          )}
        >
          <span className="text-3xl">{lang.icon}</span>
          <span
            className={cn(
              "font-semibold",
              selected === lang.id ? "text-primary" : "text-foreground"
            )}
          >
            {lang.name}
          </span>
        </button>
      ))}
    </div>
  );
}
