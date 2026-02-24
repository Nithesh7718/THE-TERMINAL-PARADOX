import { useState, useEffect } from "react";
import { Users, Trophy, Activity, TrendingUp, Star, PlayCircle, StopCircle } from "lucide-react";
import { getUsers, type AppUser } from "@/react-app/lib/adminData";
import { isGameStarted, startGame, stopGame } from "@/react-app/lib/gameState";
import { toast } from "sonner";

function StatCard({
    icon: Icon, label, value, sub, color,
}: { icon: React.ElementType; label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}20`, boxShadow: `0 0 20px ${color}20` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-white text-2xl font-black">{value}</p>
                {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// Pure SVG bar chart
function BarChart({ data }: { data: { name: string; value: number }[] }) {
    const max = Math.max(...data.map(d => d.value), 1);
    const W = 560, H = 200, PAD_L = 36, PAD_B = 28, INNER_W = W - PAD_L - 8, INNER_H = H - PAD_B - 8;
    const barW = INNER_W / data.length;
    const COLORS = ["#8b5cf6", "#6366f1", "#a78bfa", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1", "#a78bfa", "#4f46e5", "#7c3aed"];

    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
                {/* Y gridlines */}
                {[0, 25, 50, 75, 100].map(v => {
                    const y = 8 + INNER_H - (v / 100) * INNER_H;
                    return (
                        <g key={v}>
                            <line x1={PAD_L} y1={y} x2={W - 8} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            <text x={PAD_L - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">{v}</text>
                        </g>
                    );
                })}
                {/* Bars */}
                {data.map((d, i) => {
                    const bh = (d.value / max) * INNER_H;
                    const x = PAD_L + i * barW + barW * 0.15;
                    const y = 8 + INNER_H - bh;
                    const w = barW * 0.7;
                    return (
                        <g key={i}>
                            <rect x={x} y={y} width={w} height={bh} rx="4" fill={COLORS[i % COLORS.length]} opacity="0.85" />
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

// Pure SVG donut chart
function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const R = 60, CX = 90, CY = 80;
    let angle = -Math.PI / 2;
    const slices = data.map(d => {
        const sweep = (d.value / total) * 2 * Math.PI;
        const a1 = angle, a2 = angle + sweep;
        angle = a2;
        const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
        const x2 = CX + R * Math.cos(a2), y2 = CY + R * Math.sin(a2);
        const r2 = 38;
        const ix1 = CX + r2 * Math.cos(a1), iy1 = CY + r2 * Math.sin(a1);
        const ix2 = CX + r2 * Math.cos(a2), iy2 = CY + r2 * Math.sin(a2);
        const large = sweep > Math.PI ? 1 : 0;
        return { ...d, path: `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${r2},${r2} 0 ${large} 0 ${ix1},${iy1} Z` };
    });

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <svg viewBox="0 0 180 160" className="w-44 shrink-0">
                {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
                <text x={CX} y={CY - 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{total}</text>
                <text x={CX} y={CY + 12} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">users</text>
            </svg>
            <div className="space-y-2">
                {slices.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                        {s.name}: <span className="text-white/80 font-semibold">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [gameActive, setGameActive] = useState(isGameStarted);
    useEffect(() => { setUsers(getUsers()); }, []);

    const toggleGame = () => {
        if (gameActive) {
            stopGame();
            setGameActive(false);
            toast.success("Game stopped. Users are back in the waiting room.");
        } else {
            startGame();
            setGameActive(true);
            toast.success("🚀 Game started! Users can now play.");
        }
    };

    const totalUsers = users.length;
    const activeSessions = users.filter(u => u.status === "active").length;
    const avgScore = users.length ? Math.round(users.reduce((s, u) => s + u.score, 0) / users.length) : 0;
    const fullyCompleted = users.filter(u => u.roundsCompleted === 3).length;
    const top10 = [...users].sort((a, b) => b.score - a.score).slice(0, 10);
    const barData = top10.map(u => ({ name: u.name, value: u.score }));
    const roundDist = [
        { name: "0 Rounds", value: users.filter(u => u.roundsCompleted === 0).length, color: "#4f46e5" },
        { name: "1 Round", value: users.filter(u => u.roundsCompleted === 1).length, color: "#7c3aed" },
        { name: "2 Rounds", value: users.filter(u => u.roundsCompleted === 2).length, color: "#8b5cf6" },
        { name: "3 Rounds", value: users.filter(u => u.roundsCompleted === 3).length, color: "#a78bfa" },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-white text-2xl font-bold">Dashboard</h2>
                    <p className="text-white/40 text-sm mt-1">Overview of all participants and activity</p>
                </div>
                {/* Game control */}
                <button onClick={toggleGame}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${gameActive
                            ? "bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30"
                            : "bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30"
                        } shadow-lg`}>
                    {gameActive ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    {gameActive ? "Stop Game" : "Start Game"}
                    <span className={`w-2 h-2 rounded-full animate-pulse ${gameActive ? "bg-emerald-400" : "bg-red-400"}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={totalUsers} sub="registered participants" color="#8b5cf6" />
                <StatCard icon={Activity} label="Active Sessions" value={activeSessions} sub={`${totalUsers - activeSessions} inactive`} color="#06b6d4" />
                <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} sub="across all users" color="#10b981" />
                <StatCard icon={Trophy} label="Completed All 3" value={fullyCompleted} sub="champions" color="#f59e0b" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-violet-400" />
                        <h3 className="text-white font-semibold text-sm">Top 10 Scores</h3>
                    </div>
                    <BarChart data={barData} />
                </div>
                <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-violet-400" />
                        <h3 className="text-white font-semibold text-sm">Round Progress</h3>
                    </div>
                    <DonutChart data={roundDist} />
                </div>
            </div>

            {/* Mini leaderboard */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-white font-semibold text-sm">Live Leaderboard — Top 10</h3>
                </div>
                <div className="space-y-2">
                    {top10.map((user, i) => (
                        <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0
                ${i === 0 ? "bg-amber-500/30 text-amber-400" : i === 1 ? "bg-slate-400/20 text-slate-300" : i === 2 ? "bg-orange-700/20 text-orange-500" : "bg-white/5 text-white/30"}`}>
                                {i + 1}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 flex items-center justify-center text-xs font-bold text-violet-300 border border-violet-500/20 shrink-0">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white/90 text-sm font-medium truncate">{user.name}</p>
                                <p className="text-white/30 text-xs">{user.roundsCompleted}/3 rounds</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="hidden sm:block w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${user.score}%` }} />
                                </div>
                                <span className={`text-sm font-bold ${i < 3 ? "text-amber-400" : "text-violet-400"}`}>{user.score}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
