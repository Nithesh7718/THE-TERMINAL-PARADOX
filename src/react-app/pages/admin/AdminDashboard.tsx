import { useState, useEffect } from "react";
import { Users, Trophy, Activity, TrendingUp, Star, PlayCircle, StopCircle, Download, ShieldCheck } from "lucide-react";
import { subscribeToUsers, type FSUser } from "@/react-app/lib/userService";
import { subscribeToGameState, startGame, stopGame, sendBroadcast, type GameState } from "@/react-app/lib/gameState";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";
import { downloadSEBConfig } from "@/react-app/lib/sebDetection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/react-app/lib/firebase";

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                data-color={color}
                ref={(el) => {
                    if (el) {
                        el.style.background = `${color}20`;
                        el.style.boxShadow = `0 0 20px ${color}20`;
                    }
                }}
            >
                <Icon className="w-6 h-6" ref={(el: SVGSVGElement | null) => { if (el) el.style.color = color; }} />
            </div>
            <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-white text-2xl font-black">{value}</p>
                {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function BarChart({ data }: { data: { name: string; value: number }[] }) {
    const max = Math.max(...data.map(d => d.value), 1);
    const W = 560, H = 200, PAD_L = 36, PAD_B = 28, INNER_W = W - PAD_L - 8, INNER_H = H - PAD_B - 8;
    const barW = INNER_W / Math.max(data.length, 1);
    const COLORS = ["#8b5cf6", "#6366f1", "#a78bfa", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1", "#a78bfa", "#4f46e5", "#7c3aed"];
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px]">
                {[0, 25, 50, 75, 100].map(v => {
                    const y = 8 + INNER_H - (v / 100) * INNER_H;
                    return <g key={v}>
                        <line x1={PAD_L} y1={y} x2={W - 8} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <text x={PAD_L - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">{v}</text>
                    </g>;
                })}
                {data.map((d, i) => {
                    const bh = (d.value / max) * INNER_H;
                    const x = PAD_L + i * barW + barW * 0.15;
                    const y = 8 + INNER_H - bh;
                    const w = barW * 0.7;
                    return <g key={i}>
                        <rect x={x} y={y} width={w} height={bh} rx="4" fill={COLORS[i % COLORS.length]} opacity="0.85" />
                        <text x={x + w / 2} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">
                            {d.name.split(" ")[0]}
                        </text>
                    </g>;
                })}
            </svg>
        </div>
    );
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<FSUser[]>([]);
    const [gameState, setGameState] = useState<GameState>({ started: false, activeRound: 1, broadcastMessage: "" });
    const [toggling, setToggling] = useState(false);
    const [entryPw, setEntryPw] = useState("");
    const [quitPw, setQuitPw] = useState("");
    const [sebSaving, setSebSaving] = useState(false);
    const [sebOpen, setSebOpen] = useState(false);
    const [broadcastInput, setBroadcastInput] = useState("");
    const [broadcastSending, setBroadcastSending] = useState(false);

    // Real-time users from Firestore
    useEffect(() => {
        const unsub = subscribeToUsers(setUsers);
        return unsub;
    }, []);

    // Real-time game state from Firestore
    useEffect(() => {
        const unsub = subscribeToGameState(setGameState);
        return unsub;
    }, []);

    // Load SEB settings from Firestore
    useEffect(() => {
        (async () => {
            try {
                const snap = await getDoc(doc(db, "config", "sebSettings"));
                if (snap.exists()) {
                    const d = snap.data();
                    setEntryPw(d.entryPassword || "");
                    setQuitPw(d.quitPassword || "");
                }
            } catch { /* first run, no settings yet */ }
        })();
    }, []);

    const toggleGame = async () => {
        setToggling(true);
        try {
            if (gameState.started) {
                await stopGame();
                toast.success("Game stopped. Users returned to waiting room.");
            } else {
                await startGame();
                toast.success("🚀 Game started! All participants notified instantly.");
            }
        } catch {
            toast.error("Failed to update game state.");
        } finally {
            setToggling(false);
        }
    };

    const handleSendBroadcast = async () => {
        if (!broadcastInput.trim()) return;
        setBroadcastSending(true);
        try {
            await sendBroadcast(broadcastInput);
            toast.success("Message broadcasted to all participants!");
            setBroadcastInput("");
        } catch { toast.error("Failed to send."); }
        setBroadcastSending(false);
    };

    const handleClearBroadcast = async () => {
        try {
            await sendBroadcast("");
            toast.success("Broadcast cleared.");
        } catch { toast.error("Failed to clear."); }
    };


    const totalUsers = users.length;
    const activeSessions = users.filter(u => u.status === "active").length;
    const avgScore = users.length ? Math.round(users.reduce((s, u) => s + u.score, 0) / users.length) : 0;
    const fullyCompleted = users.filter(u => u.roundsCompleted >= 3).length;
    const top10 = users.slice(0, 10);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-white text-2xl font-bold">Dashboard</h2>
                    <p className="text-white/40 text-sm mt-1">Live overview — updates in real-time via Firebase</p>
                </div>
                <button onClick={toggleGame} disabled={toggling}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${gameState.started
                        ? "bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30"
                        : "bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30"
                        } shadow-lg`}>
                    {gameState.started ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    {toggling ? "Updating…" : gameState.started ? "Stop Game" : "Start Game"}
                    <span className={`w-2 h-2 rounded-full animate-pulse ${gameState.started ? "bg-emerald-400" : "bg-red-400"}`} />
                </button>
                <button onClick={async () => {
                    await downloadSEBConfig(window.location.origin, { quitPassword: quitPw });
                    toast.success("SEB config downloaded!");
                }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 transition-all shadow-lg">
                    <Download className="w-4 h-4" />
                    Download SEB Config
                </button>
            </div>

            {/* SEB Settings Panel */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <h3 className="text-white font-semibold text-sm">SEB Security Settings</h3>
                    </div>
                    <button onClick={() => setSebOpen(!sebOpen)}
                        className="text-xs text-white/40 hover:text-white/60 transition-colors">
                        {sebOpen ? "Collapse" : "Expand"}
                    </button>
                </div>
                {sebOpen && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                                    Entry Password <span className="normal-case text-white/20">(to start exam)</span>
                                </label>
                                <input type="text" value={entryPw} onChange={e => setEntryPw(e.target.value)}
                                    placeholder="Leave empty for no password"
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                                    Quit Password <span className="normal-case text-white/20">(to exit SEB)</span>
                                </label>
                                <input type="text" value={quitPw} onChange={e => setQuitPw(e.target.value)}
                                    placeholder="Leave empty to block quitting"
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={async () => {
                                setSebSaving(true);
                                try {
                                    await setDoc(doc(db, "config", "sebSettings"), { entryPassword: entryPw, quitPassword: quitPw });
                                    toast.success("SEB passwords saved to Firebase.");
                                } catch { toast.error("Failed to save."); }
                                setSebSaving(false);
                            }} disabled={sebSaving}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
                                {sebSaving ? "Saving…" : "Save Passwords"}
                            </button>
                            <p className="text-xs text-white/20">Changes take effect instantly — no need to redistribute .seb files</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Broadcast Panel — full width now */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Megaphone className="w-4 h-4 text-orange-400" />
                    <h3 className="text-white font-semibold text-sm">Global Broadcast — Live Message</h3>
                </div>
                <div className="flex gap-2">
                    <input type="text" value={broadcastInput} onChange={e => setBroadcastInput(e.target.value)}
                        placeholder="Type a message for all participants..."
                        onKeyDown={e => e.key === "Enter" && handleSendBroadcast()}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all" />
                    <button onClick={handleSendBroadcast} disabled={broadcastSending || !broadcastInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-all disabled:opacity-50">
                        {broadcastSending ? "…" : "Send"}
                    </button>
                </div>
                {gameState.broadcastMessage && (
                    <div className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/3 border border-white/5">
                        <p className="text-xs text-orange-200/60 truncate italic">Live: "{gameState.broadcastMessage}"</p>
                        <button onClick={handleClearBroadcast} className="text-[10px] text-white/20 hover:text-white/40 font-bold uppercase">Clear</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Registered" value={totalUsers} sub="participants" color="#8b5cf6" />
                <StatCard icon={Activity} label="Active Now" value={activeSessions} sub={`${totalUsers - activeSessions} inactive`} color="#06b6d4" />
                <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} sub="across all users" color="#10b981" />
                <StatCard icon={Trophy} label="Completed All" value={fullyCompleted} sub="3/3 rounds done" color="#f59e0b" />
            </div>

            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-violet-400" />
                    <h3 className="text-white font-semibold text-sm">Top 10 Scores — Live</h3>
                </div>
                <BarChart data={top10.map(u => ({ name: u.name, value: u.score }))} />
            </div>

            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h3 className="text-white font-semibold text-sm">All Participants — {totalUsers} registered</h3>
                </div>
                <div className="divide-y divide-white/3">
                    {users.map((user, i) => (
                        <div key={user.id} className="flex items-center gap-4 px-6 py-3 hover:bg-white/2 transition-colors">
                            <span className="text-white/25 text-sm font-bold w-5 shrink-0">#{i + 1}</span>
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white/90 text-sm font-medium truncate">{user.name}</p>
                                <p className="text-white/30 text-xs truncate">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-400" : "bg-white/20"}`} />
                                <span className="text-white/30 text-xs hidden sm:block">{user.roundsCompleted}/3</span>
                                <div className="hidden sm:block w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-violet-500 rounded-full"
                                        ref={(el) => { if (el) el.style.width = `${user.score}%`; }}
                                    />
                                </div>
                                <span className="text-violet-400 text-sm font-bold">{user.score}%</span>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="px-6 py-12 text-center text-white/20 text-sm">
                            No participants yet. Share the link and wait for registrations.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
