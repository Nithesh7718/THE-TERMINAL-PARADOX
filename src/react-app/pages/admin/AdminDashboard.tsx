import { useState, useEffect } from "react";
import {
    Users,
    Trophy,
    Activity,
    TrendingUp,
    Star,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { getUsers, type AppUser } from "@/react-app/lib/adminData";

const COLORS = ["#8b5cf6", "#6366f1", "#a78bfa", "#4f46e5", "#7c3aed"];

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    color: string;
}) {
    return (
        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}20`, boxShadow: `0 0 20px ${color}20` }}
            >
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

export default function AdminDashboard() {
    const [users, setUsers] = useState<AppUser[]>([]);

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const totalUsers = users.length;
    const activeSessions = users.filter((u) => u.status === "active").length;
    const avgScore = users.length
        ? Math.round(users.reduce((s, u) => s + u.score, 0) / users.length)
        : 0;
    const fullyCompleted = users.filter((u) => u.roundsCompleted === 3).length;

    // Bar chart data: top 10 by score
    const top10 = [...users].sort((a, b) => b.score - a.score).slice(0, 10);

    // Pie chart: rounds completed distribution
    const roundDist = [
        { name: "0 Rounds", value: users.filter((u) => u.roundsCompleted === 0).length },
        { name: "1 Round", value: users.filter((u) => u.roundsCompleted === 1).length },
        { name: "2 Rounds", value: users.filter((u) => u.roundsCompleted === 2).length },
        { name: "3 Rounds", value: users.filter((u) => u.roundsCompleted === 3).length },
    ].filter((d) => d.value > 0);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-white text-2xl font-bold">Dashboard</h2>
                <p className="text-white/40 text-sm mt-1">Overview of all participants and activity</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={totalUsers} sub="registered participants" color="#8b5cf6" />
                <StatCard icon={Activity} label="Active Sessions" value={activeSessions} sub={`${totalUsers - activeSessions} inactive`} color="#06b6d4" />
                <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} sub="across all users" color="#10b981" />
                <StatCard icon={Trophy} label="Completed All 3" value={fullyCompleted} sub="champions" color="#f59e0b" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bar: top 10 scores */}
                <div className="xl:col-span-2 bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="w-4 h-4 text-violet-400" />
                        <h3 className="text-white font-semibold text-sm">Top 10 Scores</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={top10} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                                tickFormatter={(v: string) => v.split(" ")[0]}
                            />
                            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                                itemStyle={{ color: "#a78bfa" }}
                                formatter={(v: number) => [`${v}%`, "Score"]}
                            />
                            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                {top10.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie: round progress distribution */}
                <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-4 h-4 text-violet-400" />
                        <h3 className="text-white font-semibold text-sm">Round Progress</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={roundDist}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {roundDist.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                                itemStyle={{ color: "#a78bfa" }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                                formatter={(v) => <span style={{ color: "rgba(255,255,255,0.5)" }}>{v}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
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
                        <div
                            key={user.id}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors"
                        >
                            <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0
                  ${i === 0 ? "bg-amber-500/30 text-amber-400" : i === 1 ? "bg-slate-400/20 text-slate-300" : i === 2 ? "bg-orange-700/20 text-orange-500" : "bg-white/5 text-white/30"}`}
                            >
                                {i + 1}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 flex items-center justify-center text-xs font-bold text-violet-300 border border-violet-500/20 shrink-0">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white/90 text-sm font-medium truncate">{user.name}</p>
                                <p className="text-white/30 text-xs">{user.roundsCompleted}/3 rounds</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-1">
                                    <div
                                        className="h-1.5 rounded-full bg-violet-500"
                                        style={{ width: `${user.score}px`, maxWidth: 80, minWidth: 8 }}
                                    />
                                </div>
                                <span className={`text-sm font-bold ${i < 3 ? "text-amber-400" : "text-violet-400"}`}>
                                    {user.score}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
