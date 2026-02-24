import { useState } from "react";
import { useNavigate } from "react-router";
import { Terminal, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { login } from "@/react-app/lib/adminAuth";
import { toast } from "sonner";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("Please enter both username and password.");
            return;
        }
        setLoading(true);
        // Simulate slight network delay
        setTimeout(() => {
            const session = login(username.trim(), password);
            if (session) {
                toast.success(`Welcome back, ${session.username}!`);
                navigate("/admin/dashboard", { replace: true });
            } else {
                toast.error("Invalid credentials. Access denied.");
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            {/* Ambient glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.1)]">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                            <Terminal className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
                        <p className="text-sm text-white/40">Terminal Paradox Control Panel</p>
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-6">
                        <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                        <p className="text-xs text-violet-300">
                            Restricted access. Unauthorized entry is prohibited.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                id="admin-username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="admin"
                                autoComplete="username"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="admin-password"
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(p => !p)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                        >
                            {loading ? "Authenticating…" : "Sign In"}
                        </button>
                    </form>

                    {/* Hint */}
                    <div className="mt-6 p-3 rounded-lg bg-white/3 border border-white/5">
                        <p className="text-xs text-white/25 text-center font-mono">
                            demo: admin / admin@tp2024
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
