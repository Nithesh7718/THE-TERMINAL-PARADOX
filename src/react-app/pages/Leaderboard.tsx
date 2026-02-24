import { useNavigate } from "react-router";
import {
    ArrowLeft,
    Trophy,
    Medal,
    Star,
    Clock,
    Code2,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";

// Stub leaderboard data — replace with real API call when backend is ready
const stubEntries = [
    { rank: 1, name: "Arjun Sharma", score: 97, time: "12:34", rounds: 3, badge: "Champion" },
    { rank: 2, name: "Priya Nair", score: 94, time: "14:02", rounds: 3, badge: "Champion" },
    { rank: 3, name: "Karthik R", score: 91, time: "15:47", rounds: 3, badge: "Champion" },
    { rank: 4, name: "Dev Patel", score: 88, time: "17:11", rounds: 3, badge: "Expert" },
    { rank: 5, name: "Sneha Rao", score: 85, time: "18:30", rounds: 3, badge: "Expert" },
    { rank: 6, name: "Rohan Kumar", score: 79, time: "20:05", rounds: 2, badge: "Debugger" },
    { rank: 7, name: "Ananya M", score: 74, time: "22:14", rounds: 2, badge: "Debugger" },
    { rank: 8, name: "Vikram S", score: 68, time: "24:50", rounds: 2, badge: "Debugger" },
    { rank: 9, name: "Meera J", score: 62, time: "27:33", rounds: 1, badge: "Coder" },
    { rank: 10, name: "Aditya B", score: 55, time: "29:48", rounds: 1, badge: "Coder" },
];

const badgeColors: Record<string, string> = {
    Champion: "from-yellow-500 to-amber-400 text-black",
    Expert: "from-primary to-chart-1 text-primary-foreground",
    Debugger: "from-chart-4 to-chart-5 text-white",
    Coder: "from-secondary to-secondary text-foreground",
};

const rankColors: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-slate-300",
    3: "text-amber-600",
};

const rankIcons: Record<number, typeof Trophy> = {
    1: Trophy,
    2: Medal,
    3: Star,
};

export default function Leaderboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-3/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Back button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className="mb-8 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-amber-400/10 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                        <Trophy className="w-10 h-10 text-yellow-400" />
                    </div>
                    <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-primary bg-clip-text text-transparent">
                        Leaderboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Top performers across all rounds of The Terminal Paradox
                    </p>
                </div>

                {/* Top 3 podium */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[stubEntries[1], stubEntries[0], stubEntries[2]].map(
                        (entry, podiumIndex) => {
                            const positions = [2, 1, 3];
                            const pos = positions[podiumIndex];
                            const heights = ["h-28", "h-36", "h-24"];
                            const Icon = rankIcons[pos];
                            return (
                                <div
                                    key={entry.rank}
                                    className={cn(
                                        "flex flex-col items-center",
                                        podiumIndex === 1 && "order-2"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-16 h-16 rounded-full mb-3 flex items-center justify-center",
                                            "bg-gradient-to-br from-card to-secondary border-2",
                                            pos === 1 && "border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]",
                                            pos === 2 && "border-slate-300",
                                            pos === 3 && "border-amber-600"
                                        )}
                                    >
                                        <Icon
                                            className={cn("w-7 h-7", rankColors[pos])}
                                        />
                                    </div>
                                    <p className="text-sm font-bold text-foreground text-center mb-1 truncate max-w-[100px]">
                                        {entry.name}
                                    </p>
                                    <p className={cn("text-2xl font-black mb-3", rankColors[pos])}>
                                        {entry.score}%
                                    </p>
                                    <div
                                        className={cn(
                                            "w-full rounded-t-xl flex items-center justify-center text-2xl font-black",
                                            heights[podiumIndex],
                                            pos === 1 &&
                                            "bg-gradient-to-b from-yellow-500/30 to-yellow-500/10 border border-yellow-500/30 text-yellow-400",
                                            pos === 2 &&
                                            "bg-gradient-to-b from-slate-400/20 to-slate-400/5 border border-slate-400/30 text-slate-300",
                                            pos === 3 &&
                                            "bg-gradient-to-b from-amber-700/30 to-amber-700/10 border border-amber-700/30 text-amber-600"
                                        )}
                                    >
                                        #{pos}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                {/* Full rankings table */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                        <Code2 className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-foreground">All Rankings</h2>
                    </div>

                    <div className="divide-y divide-border">
                        {stubEntries.map((entry) => {
                            const Icon = rankIcons[entry.rank];
                            return (
                                <div
                                    key={entry.rank}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/30",
                                        entry.rank <= 3 && "bg-secondary/10"
                                    )}
                                >
                                    {/* Rank */}
                                    <div className="w-8 text-center">
                                        {Icon ? (
                                            <Icon
                                                className={cn(
                                                    "w-5 h-5 mx-auto",
                                                    rankColors[entry.rank]
                                                )}
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-muted-foreground">
                                                #{entry.rank}
                                            </span>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-chart-1/30 flex items-center justify-center text-sm font-bold text-primary border border-primary/20 shrink-0">
                                        {entry.name.charAt(0)}
                                    </div>

                                    {/* Name + badge */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground text-sm truncate">
                                            {entry.name}
                                        </p>
                                        <span
                                            className={cn(
                                                "text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r",
                                                badgeColors[entry.badge]
                                            )}
                                        >
                                            {entry.badge}
                                        </span>
                                    </div>

                                    {/* Rounds */}
                                    <div className="text-center hidden sm:block">
                                        <p className="text-xs text-muted-foreground">Rounds</p>
                                        <p className="text-sm font-bold text-foreground">
                                            {entry.rounds}/3
                                        </p>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center gap-1 text-muted-foreground hidden sm:flex">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs">{entry.time}</span>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <p className="text-lg font-black text-primary">
                                            {entry.score}%
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Note about live data */}
                <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
                    * Leaderboard shows demo data. Live scoring requires backend integration.
                </p>
            </div>
        </div>
    );
}
