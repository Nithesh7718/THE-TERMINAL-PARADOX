import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Code2, Trophy, Timer, Shield, LogOut } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import RoundSection from "@/react-app/components/RoundSection";
import { getUserSession, clearUserSession } from "@/react-app/pages/Login";
import { clearEntryGate, getExitPassword } from "@/react-app/pages/ExamGate";
import { toast } from "sonner";

// Read the highest completed round from localStorage (default: 0 = none done)
function getCompletedRounds(): number {
  try {
    return parseInt(localStorage.getItem("completedRound") || "0", 10);
  } catch {
    return 0;
  }
}

// Stub data for demonstration
const stubRounds = [{
  roundNumber: 1 as const,
  title: "Quiz Challenge",
  subtitle: "15 MCQ questions • 15 minutes • Score ≥50% to advance",
  doors: [{
    number: 1,
    title: "Logic Gate",
    description: "Test your programming fundamentals",
    status: "available" as const
  }, {
    number: 2,
    title: "Algorithm Alley",
    description: "Data structures and algorithms",
    status: "available" as const
  }, {
    number: 3,
    title: "System Path",
    description: "Operating systems and networks",
    status: "available" as const
  }]
}, {
  roundNumber: 2 as const,
  title: "Debug Arena",
  subtitle: "5 debug problems • 15 minutes • Fix the bugs",
  doors: [{
    number: 1,
    title: "Syntax Maze",
    description: "Find and fix syntax errors",
    status: "locked" as const
  }, {
    number: 2,
    title: "Logic Trap",
    description: "Debug logical errors",
    status: "locked" as const
  }, {
    number: 3,
    title: "Runtime Rush",
    description: "Handle runtime exceptions",
    status: "locked" as const
  }]
}, {
  roundNumber: 3 as const,
  title: "Coding Conquest",
  subtitle: "3 coding problems • 30 minutes • Full implementation",
  doors: [{
    number: 1,
    title: "Array Forge",
    description: "Array manipulation challenges",
    status: "locked" as const
  }, {
    number: 2,
    title: "String Sanctum",
    description: "String processing puzzles",
    status: "locked" as const
  }, {
    number: 3,
    title: "Graph Gateway",
    description: "Graph traversal problems",
    status: "locked" as const
  }]
}];
const features = [{
  icon: Trophy,
  title: "3 Challenging Rounds",
  description: "Progress through Quiz, Debug, and Coding challenges"
}, {
  icon: Timer,
  title: "Timed Challenges",
  description: "Race against the clock to prove your skills"
}, {
  icon: Shield,
  title: "Secure Testing",
  description: "Server-side validation and code execution"
}];
export default function Home() {
  const navigate = useNavigate();
  const roundsRef = useRef<HTMLDivElement>(null);
  const [userSession, setUserSession] = useState(() => getUserSession());
  // currentRound is 1-based: 1 = only Round 1 open, 2 = Rounds 1+2 open, etc.
  const [currentRound] = useState(() => (getCompletedRounds() + 1));
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitPwInput, setExitPwInput] = useState("");
  const [exitPwRequired, setExitPwRequired] = useState("");
  const [exitChecking, setExitChecking] = useState(false);

  // Load exit password on mount
  useEffect(() => {
    getExitPassword().then(pw => setExitPwRequired(pw));
  }, []);

  const handleSignOut = () => {
    if (exitPwRequired) {
      // Exit password is set — show the modal
      setExitModalOpen(true);
      setExitPwInput("");
    } else {
      // No exit password — sign out directly
      clearEntryGate();
      clearUserSession();
      setUserSession(null);
      navigate("/login", { replace: true });
    }
  };

  const confirmExit = () => {
    setExitChecking(true);
    if (exitPwInput === exitPwRequired) {
      clearEntryGate();
      clearUserSession();
      setUserSession(null);
      toast.success("Signed out successfully.");
      navigate("/login", { replace: true });
    } else {
      toast.error("Incorrect exit password.");
      setExitChecking(false);
    }
  };

  // Compute rounds with correct door statuses based on progress
  const rounds = stubRounds.map(round => ({
    ...round,
    doors: round.doors.map(door => ({
      ...door,
      status: round.roundNumber < currentRound
        ? "completed" as const
        : round.roundNumber === currentRound
          ? "available" as const
          : "locked" as const,
    }))
  }));

  const handleScrollToRounds = () => {
    roundsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDoorSelect = (roundNumber: number, doorNumber: number) => {
    if (roundNumber === 1) {
      navigate(`/quiz/${doorNumber}`);
    } else if (roundNumber === 2) {
      navigate(`/debug/${doorNumber}`);
    } else if (roundNumber === 3) {
      navigate(`/coding/${doorNumber}`);
    }
  };
  return <div className="min-h-screen bg-background">
    {/* Animated background */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-3/5 rounded-full blur-3xl" />
    </div>

    {/* Content */}
    <div className="relative z-10">
      {/* Hero Section */}
      <header className="relative py-20 px-6 text-center overflow-hidden">
        {/* Top nav */}
        <div className="absolute top-4 right-6 flex items-center gap-3">
          {userSession && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                👋 {userSession.name}
              </span>
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="gap-1.5 text-muted-foreground hover:text-foreground">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Button>
            </>
          )}
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_rgba(45,212,191,0.3)]">
            <Code2 className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-chart-3 to-accent bg-clip-text text-transparent">THE TERMINAL PARADOX</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            3 Rounds • 3 Doors • 1 Champion
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-8">
            Challenge yourself through three intense rounds of programming
            mastery. Choose your path wisely – each door holds unique
            challenges.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              size="lg"
              onClick={handleScrollToRounds}
              className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground font-semibold px-8 shadow-[0_0_20px_rgba(45,212,191,0.4)]"
            >
              Start Challenge
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map(feature => <div key={feature.title} className="p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>)}
          </div>
        </div>
      </header>

      {/* Rounds Section */}
      <main className="px-6 pb-20">
        <div ref={roundsRef} className="max-w-6xl mx-auto space-y-8">
          {rounds.map(round => <RoundSection key={round.roundNumber} roundNumber={round.roundNumber} title={round.title} subtitle={round.subtitle} doors={round.doors} isActive={round.roundNumber <= currentRound} onDoorSelect={doorNumber => handleDoorSelect(round.roundNumber, doorNumber)} />)}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>The Terminal Paradox – 3 Rounds 3 Doors Challenge</p>
          <p className="mt-1 opacity-60">
            Prove your programming prowess across multiple domains
          </p>
        </div>
      </footer>

      {/* Exit Password Modal */}
      {exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-[0_0_60px_rgba(239,68,68,0.1)]">
            <h3 className="text-foreground font-bold text-lg mb-2">Exit Password Required</h3>
            <p className="text-muted-foreground text-sm mb-5">
              Enter the exit password to sign out of the exam.
            </p>
            <input
              type="password"
              value={exitPwInput}
              onChange={(e) => setExitPwInput(e.target.value)}
              placeholder="Enter exit password"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && confirmExit()}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder-muted-foreground/40 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setExitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                disabled={!exitPwInput || exitChecking}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {exitChecking ? "Checking…" : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>;
}