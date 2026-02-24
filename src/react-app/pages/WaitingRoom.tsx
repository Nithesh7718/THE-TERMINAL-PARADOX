import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Terminal, Clock, Wifi, LogOut } from "lucide-react";
import { getUserSession, clearUserSession } from "@/react-app/pages/Login";
import { isGameStarted } from "@/react-app/lib/gameState";
import { toast } from "sonner";

export default function WaitingRoom() {
    const navigate = useNavigate();
    const session = getUserSession();
    const [dots, setDots] = useState(".");
    const [tick, setTick] = useState(0);

    // Redirect if not logged in
    useEffect(() => {
        if (!session) { navigate("/login", { replace: true }); }
    }, [session, navigate]);

    // Animated dots
    useEffect(() => {
        const id = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
        return () => clearInterval(id);
    }, []);

    // Poll game state every 3 seconds
    useEffect(() => {
        const id = setInterval(() => {
            setTick(t => t + 1);
            if (isGameStarted()) {
                toast.success("🚀 The game has started! Good luck!");
                navigate("/home", { replace: true });
            }
        }, 3000);
        return () => clearInterval(id);
    }, [navigate]);

    // Also check immediately on mount
    useEffect(() => {
        if (isGameStarted()) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const handleSignOut = () => {
        clearUserSession();
        navigate("/login", { replace: true });
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
            {/* Background glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-3/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-lg w-full">
                {/* Logo */}
                <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-primary to-chart-1 shadow-[0_0_40px_rgba(45,212,191,0.3)]">
                    <Terminal className="w-10 h-10 text-primary-foreground" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-primary via-chart-3 to-chart-1 bg-clip-text text-transparent">
                    THE TERMINAL PARADOX
                </h1>
                <p className="text-muted-foreground mb-12">3 Rounds · 3 Doors · 1 Champion</p>

                {/* Waiting card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_40px_rgba(45,212,191,0.06)] mb-8">
                    {/* Pulse icon */}
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                            <Wifi className="w-7 h-7 text-primary" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-2">
                        Waiting for the game to start{dots}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Hi <span className="text-foreground font-semibold">{session.name}</span>! You're all set.<br />
                        The admin will start the game shortly. Stay on this page.
                    </p>

                    {/* Status row */}
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span>Game not started</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Polling every 3s</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="grid grid-cols-3 gap-3 mb-8 text-xs text-muted-foreground">
                    {["Round 1\nQuiz Challenge", "Round 2\nDebug Arena", "Round 3\nCoding Conquest"].map((label, i) => (
                        <div key={i} className="bg-card/50 border border-border rounded-xl p-3">
                            {label.split("\n").map((l, j) => (
                                <p key={j} className={j === 0 ? "font-semibold text-foreground" : "mt-0.5 opacity-60"}>{l}</p>
                            ))}
                        </div>
                    ))}
                </div>

                <button onClick={handleSignOut}
                    className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <LogOut className="w-4 h-4" /> Sign out
                </button>

                {/* Hidden tick counter to show liveness */}
                <p className="text-xs text-muted-foreground/20 mt-4">Check #{tick}</p>
            </div>
        </div>
    );
}
