import { useState, useEffect } from "react";
import { useNavigate, Outlet, Navigate } from "react-router";
import {
    LayoutDashboard,
    Users,
    Trophy,
    LogOut,
    Terminal,
    Menu,
    X,
    ShieldCheck,
    BookOpen,
} from "lucide-react";
import { getSession, logout, type AdminSession } from "@/react-app/lib/adminAuth";
import { cn } from "@/react-app/lib/utils";

interface AdminLayoutProps {
    requireAdmin?: boolean;
}

export default function AdminLayout({ requireAdmin = false }: AdminLayoutProps) {
    const navigate = useNavigate();
    const [session, setSession] = useState<AdminSession | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const s = getSession();
        if (!s) {
            navigate("/admin/login", { replace: true });
        } else if (requireAdmin && s.role !== "admin") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            setSession(s);
        }
    }, [navigate, requireAdmin]);

    const handleLogout = () => {
        logout();
        navigate("/admin/login", { replace: true });
    };

    if (!session) return null;

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: Trophy, label: "Leaderboard", path: "/admin/leaderboard" },
        { icon: BookOpen, label: "Question Bank", path: "/admin/questions" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-30 w-64 bg-[#0f0f1a] border-r border-white/5 flex flex-col transition-transform duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0 lg:static lg:z-auto"
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                        <Terminal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Terminal Paradox</p>
                        <p className="text-xs text-white/40">Admin Panel</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    active
                                        ? "bg-violet-500/20 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.3)]"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="px-4 py-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 flex items-center justify-center border border-violet-500/30">
                            <span className="text-xs font-bold text-violet-300">
                                {session.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session.username}</p>
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-violet-400" />
                                <p className="text-xs text-violet-400 capitalize">{session.role}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
                    <button
                        className="lg:hidden text-white/60 hover:text-white transition-colors"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <h1 className="text-white/80 text-sm font-medium">
                        Admin Control Centre
                    </h1>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-white/40">Live</span>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

// Protected redirect — use inside route definitions
export function RequireAuth() {
    const session = getSession();
    return session ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
