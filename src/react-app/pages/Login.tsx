import { useState } from "react";
import { useNavigate } from "react-router";
import { Terminal, Eye, EyeOff, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { login as adminLogin } from "@/react-app/lib/adminAuth";

const SESSION_KEY = "userSession";

export interface UserSession {
    name: string;
    email: string;
    role: "participant";
}

export function getUserSession(): UserSession | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as UserSession) : null;
    } catch { return null; }
}

export function clearUserSession(): void {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

type Mode = "login" | "register";
type Tab = "participant" | "admin";

export default function Login() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("participant");
    const [mode, setMode] = useState<Mode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { toast.error("Please fill in all fields."); return; }

        setLoading(true);

        setTimeout(() => {
            /* ── Admin tab ── */
            if (tab === "admin") {
                const session = adminLogin(email.trim(), password);
                if (session) {
                    toast.success(`Welcome back, ${session.username}!`);
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    toast.error("Invalid admin credentials.");
                    setLoading(false);
                }
                return;
            }

            /* ── Participant tab ── */
            if (mode === "register") {
                if (!name) { toast.error("Name is required."); setLoading(false); return; }
                if (localStorage.getItem(`user:${email}`)) {
                    toast.error("Account already exists. Sign in instead.");
                    setLoading(false);
                    return;
                }
                localStorage.setItem(`user:${email}`, JSON.stringify({ name, password }));
                sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, email, role: "participant" }));
                toast.success(`Welcome, ${name}! Waiting for the game to start…`);
                navigate("/waiting", { replace: true });
            } else {
                const stored = localStorage.getItem(`user:${email}`);
                if (!stored) { toast.error("No account found. Please register."); setLoading(false); return; }
                const user = JSON.parse(stored) as { name: string; password: string };
                if (user.password !== password) { toast.error("Incorrect password."); setLoading(false); return; }
                sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email, role: "participant" }));
                toast.success(`Welcome back, ${user.name}!`);
                navigate("/waiting", { replace: true });
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            {/* Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_60px_rgba(45,212,191,0.07)]">
                    {/* Logo */}
                    <div className="text-center mb-7">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary to-chart-1 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                            <Terminal className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                            THE TERMINAL PARADOX
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">3 Rounds · 3 Doors · 1 Champion</p>
                    </div>

                    {/* Admin / Participant toggle */}
                    <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6">
                        <button
                            onClick={() => setTab("participant")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "participant" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <User className="w-3.5 h-3.5" /> Participant
                        </button>
                        <button
                            onClick={() => setTab("admin")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "admin" ? "bg-violet-600 text-white shadow shadow-violet-500/30" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" /> Admin
                        </button>
                    </div>

                    {/* Participant: login/register sub-tabs */}
                    {tab === "participant" && (
                        <div className="flex gap-1 mb-5">
                            {(["login", "register"] as Mode[]).map(m => (
                                <button key={m} onClick={() => setMode(m)}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${mode === m ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {m === "login" ? "Sign In" : "Register"}
                                </button>
                            ))}
                        </div>
                    )}

                    {tab === "admin" && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-5">
                            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                            <p className="text-xs text-violet-300">Admin access only. Unauthorised entry is prohibited.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tab === "participant" && mode === "register" && (
                            <div>
                                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Arjun Sharma"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder-muted-foreground/40 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                                {tab === "admin" ? "Username" : "Email"}
                            </label>
                            <input type={tab === "admin" ? "text" : "email"} value={email} onChange={e => setEmail(e.target.value)}
                                placeholder={tab === "admin" ? "admin" : "you@example.com"} autoComplete="username"
                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder-muted-foreground/40 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>

                        <div>
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"}
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary/50 border border-border text-foreground placeholder-muted-foreground/40 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all" />
                                <button type="button" onClick={() => setShowPw(p => !p)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button id="login-submit-btn" type="submit" disabled={loading}
                            className={`w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all mt-1
                ${tab === "admin"
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    : "bg-gradient-to-r from-primary to-chart-1 text-primary-foreground shadow-[0_0_20px_rgba(45,212,191,0.25)]"}`}
                        >
                            {loading ? "Please wait…" : tab === "admin" ? "Admin Sign In" : mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
