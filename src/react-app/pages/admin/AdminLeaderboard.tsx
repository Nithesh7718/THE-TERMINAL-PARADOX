import { useState, useEffect } from "react";
import { Trophy, Medal, Star } from "lucide-react";
import { getUsers, type AppUser } from "@/react-app/lib/adminData";

const BADGE_MAP: Record<number, string> = { 3: "Champion", 2: "Expert", 1: "Coder", 0: "Lurker" };
const BADGE_COLOR: Record<string, string> = {
    Champion: "from-amber-500 to-yellow-400 text-black",
    Expert: "from-violet-500 to-indigo-400 text-white",
    Coder: "from-slate-600 to-slate-500 text-white",
    Lurker: "from-zinc-800 to-zinc-700 text-white/50",
};

// Pure SVG bar chart (shared)
function ScoreBar({ data }: { data: { name: string; score: number; rank: number }[] }) {
    const W = 560, H = 200, PAD_L = 36, PAD_B = 28, INNER_W = W - PAD_L - 8, INNER_H = H - PAD_B - 8;
    const barW = INNER_W / data.length;
    const rankColors = ["#f59e0b", "#94a3b8", "#b45309"];
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
                {[0, 25, 50, 75, 100].map(v => {
                    const y = 8 + INNER_H - (v / 100) * INNER_H;
                    return (
                        <g key={v}>
                            <line x1={PAD_L} y1={y} x2={W - 8} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            <text x={PAD_L - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">{v}</text>
                        </g>
                    );
                })}
                {data.map((d, i) => {
                    const bh = (d.score / 100) * INNER_H;
                    const x = PAD_L + i * barW + barW * 0.15;
                    const y = 8 + INNER_H - bh;
                    const w = barW * 0.7;
                    const fill = rankColors[i] ?? "#8b5cf6";
                    const opacity = i < 3 ? 1 : 0.6;
                    return (
                        <g key={i}>
                            <rect x={x} y={y} width={w} height={bh} rx="4" fill={fill} opacity={opacity} />
                            <text x={x + w / 2} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">
                                {d.name.split(" ")[0]}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default function AdminLeaderboard() {
    const [users, setUsers] = useState<AppUser[]>([]);
    useEffect(() => {
        setUsers([...getUsers()].sort((a, b) => b.score - a.score));
    }, []);

    const top10 = users.slice(0, 10);
    const podium = [users[1], users[0], users[2]].filter(Boolean);
    const podiumOrders = [2, 1, 3];
    const podiumHeights = ["h-24", "h-36", "h-20"];
    const podiumColors = [
        "from-slate-400/30 to-slate-400/5 border-slate-400/30 text-slate-300",
        "from-amber-500/30 to-amber-500/5 border-amber-500/30 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]",
        "from-orange-700/30 to-orange-700/5 border-orange-700/30 text-orange-500",
    ];

    const RankIcon = ({ rank }: { rank: number }) => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
        if (rank === 3) return <Star className="w-5 h-5 text-orange-500" />;
        return <span className="text-white/25 text-sm font-bold">#{rank}</span>;
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-white text-2xl font-bold">Leaderboard</h2>
                <p className="text-white/40 text-sm mt-1">Ranked by total score across all rounds</p>
            </div>

            {/* Podium */}
            {podium.length >= 3 && (
                <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8">
                    <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-8">Top 3</p>
                    <div className="flex items-end justify-center gap-3 sm:gap-6">
                        {podium.map((user, pi) => (
                            <div key={user.id} className="flex flex-col items-center w-28 sm:w-36">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 flex items-center justify-center text-sm font-bold text-violet-300 border border-violet-500/20 mb-2">
                                    {user.name.charAt(0)}
                                </div>
                                <p className="text-white/90 text-xs font-semibold text-center mb-1 truncate w-full">{user.name}</p>
                                <p className={`text-xl font-black mb-3 ${podiumOrders[pi] === 1 ? "text-amber-400" : podiumOrders[pi] === 2 ? "text-slate-300" : "text-orange-500"}`}>
                                    {user.score}%
                                </p>
                                <div className={`w-full rounded-t-xl border bg-gradient-to-b ${podiumColors[pi]} ${podiumHeights[pi]} flex items-center justify-center text-2xl font-black`}>
                                    #{podiumOrders[pi]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SVG bar chart */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-sm mb-4">Score Distribution — Top 10</h3>
                <ScoreBar data={top10.map((u, i) => ({ name: u.name, score: u.score, rank: i + 1 }))} />
            </div>

            {/* Full ranked table */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-white font-semibold text-sm">All Rankings</h3>
                </div>
                <div className="divide-y divide-white/3">
                    {users.map((user, i) => {
                        const badge = BADGE_MAP[user.roundsCompleted] ?? "Lurker";
                        return (
                            <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                                <div className="w-8 text-center shrink-0"><RankIcon rank={i + 1} /></div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 flex items-center justify-center text-sm font-bold text-violet-300 border border-violet-500/20 shrink-0">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/90 font-semibold text-sm truncate">{user.name}</p>
                                    <p className="text-white/30 text-xs truncate">{user.email}</p>
                                </div>
                                <span className={`hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${BADGE_COLOR[badge]}`}>
                                    {badge}
                                </span>
                                <div className="hidden md:block text-white/30 text-xs">{user.roundsCompleted}/3 rounds</div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:block w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${user.score}%` }} />
                                    </div>
                                    <span className={`text-sm font-black ${i < 3 ? "text-amber-400" : "text-violet-400"}`}>{user.score}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
