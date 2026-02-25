import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/react-app/lib/firebase";
import { toast } from "sonner";

const ENTRY_KEY = "examEntryVerified";

/** Check if user already passed the entry gate this session */
export function hasPassedEntryGate(): boolean {
    return sessionStorage.getItem(ENTRY_KEY) === "true";
}

export function clearEntryGate(): void {
    sessionStorage.removeItem(ENTRY_KEY);
}

/** Fetch exit password from Firestore (used by exit gate) */
export async function getExitPassword(): Promise<string> {
    try {
        const snap = await getDoc(doc(db, "config", "sebSettings"));
        if (snap.exists()) return snap.data()?.quitPassword || "";
    } catch { /* ignore */ }
    return "";
}

export default function ExamGate() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [requiredPw, setRequiredPw] = useState<string | null>(null);

    useEffect(() => {
        // If already verified, skip
        if (hasPassedEntryGate()) {
            navigate("/home", { replace: true });
            return;
        }

        // Load the entry password from Firestore
        (async () => {
            try {
                const snap = await getDoc(doc(db, "config", "sebSettings"));
                if (snap.exists()) {
                    const pw = snap.data()?.entryPassword || "";
                    if (!pw) {
                        // No entry password set — auto-pass
                        sessionStorage.setItem(ENTRY_KEY, "true");
                        navigate("/home", { replace: true });
                        return;
                    }
                    setRequiredPw(pw);
                } else {
                    // No settings doc — no password needed
                    sessionStorage.setItem(ENTRY_KEY, "true");
                    navigate("/home", { replace: true });
                    return;
                }
            } catch {
                // Can't reach Firestore, let them through
                sessionStorage.setItem(ENTRY_KEY, "true");
                navigate("/home", { replace: true });
                return;
            }
            setLoading(false);
        })();
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setChecking(true);

        if (password === requiredPw) {
            sessionStorage.setItem(ENTRY_KEY, "true");
            toast.success("Access granted! Good luck! 🚀");
            navigate("/home", { replace: true });
        } else {
            toast.error("Incorrect password. Ask your exam administrator.");
            setChecking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative w-full max-w-sm">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_60px_rgba(45,212,191,0.07)]">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <Lock className="w-8 h-8 text-amber-400" />
                        </div>
                        <h1 className="text-xl font-black text-foreground mb-1">Exam Entry Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter the password provided by your exam administrator to begin.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter exam password"
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder-muted-foreground/40 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!password || checking}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)]"
                        >
                            {checking ? "Verifying…" : "Enter Exam"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
