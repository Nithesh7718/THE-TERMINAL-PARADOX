import { useState, useEffect } from "react";
import { Trophy, Medal, Star, Circle } from "lucide-react";
import { subscribeToUsers, type FSUser } from "@/react-app/lib/userService";

const MEDALS: Record<number, { icon: React.ElementType; color: string; label: string }> = {
    0: { icon: Trophy, color: "#f59e0b", label: "1st" },
    1: { icon: Medal, color: "#9ca3af", label: "2nd" },
    2: { icon: Medal, color: "#92400e", label: "3rd" },
};

function ScoreBar({ score }: { score: number }) {
    const W = 200, H = 14;
    return (
        <svg width={W} height={H} className="hidden sm:block">
            <rect x={0} y={3} width={W} height={H - 6} rx={4} fill="rgba(255,255,255,0.05)" />
            <rect x={0} y={3} width={(score / 100) * W} height={H - 6} rx={4}
                fill="url(#sb)" />
            <defs>
                <linearGradient id="sb" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function AdminLeaderboard() {
    const [users, setUsers] = useState<FSUser[]>([]);

    useEffect(() => {
        const unsub = subscribeToUsers(setUsers);
        return unsub;
    }, []);

    const top3 = users.slice(0, 3);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-white text-2xl font-bold">Live Leaderboard</h2>
                <p className="text-white/40 text-sm mt-1">{users.length} participants ranked by score — updates in real-time</p>
            </div>

            {/* Podium */}
            {top3.length >= 1 && (
                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                    {[1, 0, 2].map((rankIdx) => {
                        const u = top3[rankIdx];
                        if (!u) return <div key={rankIdx} />;
                        const m = MEDALS[rankIdx];
                        const heights = { 0: "pt-0", 1: "pt-8", 2: "pt-4" };
                        return (
                            <div key={rankIdx} className={`flex flex-col items-center gap-3 ${heights[rankIdx as 0 | 1 | 2]}`}>
                                <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-white/5 text-lg font-black"
                                    style={{ borderColor: m.color }}>
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <m.icon className="w-5 h-5" style={{ color: m.color }} />
                                <p className="text-white/80 text-xs font-semibold text-center truncate w-full px-1">{u.name}</p>
                                <p className="text-sm font-black" style={{ color: m.color }}>{u.score}%</p>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <h3 className="text-white font-semibold text-sm">Full Rankings</h3>
                </div>
                <div className="divide-y divide-white/3">
                    {users.map((u, i) => {
                        const m = MEDALS[i];
                        return (
                            <div key={u.id} className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/2 ${i < 3 ? "bg-white/1" : ""}`}>
                                <div className="w-7 flex items-center justify-center shrink-0">
                                    {m ? <m.icon className="w-4 h-4" style={{ color: m.color }} /> : <span className="text-white/25 text-sm font-bold">#{i + 1}</span>}
                                </div>
                                <div className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-sm font-black text-violet-300 shrink-0">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/90 text-sm font-semibold truncate">{u.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <p className="text-white/30 text-xs">Round {u.roundsCompleted}/3</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(r => (
                                                <Circle key={r} className="w-2 h-2" fill={r <= u.roundsCompleted ? "#8b5cf6" : "transparent"}
                                                    stroke={r <= u.roundsCompleted ? "#8b5cf6" : "rgba(255,255,255,0.15)"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <ScoreBar score={u.score} />
                                <div className="text-right shrink-0">
                                    <p className="text-white font-black text-base">{u.score}<span className="text-white/30 text-xs">%</span></p>
                                </div>
                                <div className={`w-2 h-2 rounded-full shrink-0 ${u.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-white/15"}`} />
                            </div>
                        );
                    })}
                    {users.length === 0 && (
                        <div className="px-6 py-12 text-center text-white/20 text-sm">No participants yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
