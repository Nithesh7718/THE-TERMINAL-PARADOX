import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Play,
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import Timer from "@/react-app/components/Timer";
import CodeEditor from "@/react-app/components/CodeEditor";
import LanguageSelector, {
  type Language,
} from "@/react-app/components/LanguageSelector";
import { getDebugQuestions, type DebugQuestion } from "@/react-app/lib/questionService";
import { cn } from "@/react-app/lib/utils";
import { getUserSession } from "@/react-app/pages/Login";
import { updateUserScore, subscribeToUser } from "@/react-app/lib/userService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/react-app/components/ui/dialog";
import { subscribeToGameState, type GameState } from "@/react-app/lib/gameState";
import { runCode } from "@/react-app/lib/judge0";

const DEBUG_TIME_MINUTES = 15;

// ── Variable injection helpers ────────────────────────────────────────
/** Replace {0},{1},… in preamble template with space-split tokens from input */
function fillPreamble(template: string, input: string): string {
  const tokens = input.trim().split(/\s+/);
  return template.replace(/\{(\d+)\}/g, (_, i) => tokens[parseInt(i, 10)] ?? "");
}

/**
 * Build the code that actually gets sent to Judge0:
 * • Python/JS: prepend filled preamble before user code
 * • Java/C/C++: replace the /*INPUT*\/ marker inside the user code
 */
function buildCode(
  question: DebugQuestion,
  lang: string,
  userCode: string,
  tcInput: string
): string {
  const preambleTemplate = (question?.inputPreamble as Record<string, string>)?.[lang] ?? "";
  const preamble = fillPreamble(preambleTemplate, tcInput || "");
  if (userCode.includes("/*INPUT*/")) {
    return userCode.replace("/*INPUT*/", preamble);
  }
  return preamble + "\n\n" + userCode;
}

type TCStatus = "pending" | "running" | "passed" | "failed" | "error";

interface TestCaseState {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: TCStatus;
  errorMessage?: string;
  statusLabel?: string;
}

interface QuestionState {
  code: string;
  testCases: TestCaseState[];
  score: number;
  isRunning: boolean;
}

export default function DebugPage() {
  const { door } = useParams();
  const navigate = useNavigate();
  const doorNumber = parseInt(door || "1");

  const [language, setLanguage] = useState<Language | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const userSession = getUserSession();
  const [dbProgress, setDbProgress] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    return subscribeToGameState(setGameState);
  }, []);

  useEffect(() => {
    if (userSession?.email) {
      return subscribeToUser(userSession.email, (u) => {
        setDbProgress(u ? u.roundsCompleted : 0);
      });
    } else {
      setDbProgress(0);
    }
  }, [userSession]);

  // ── Progress gating: only accessible after Round 1 is complete ──
  useEffect(() => {
    if (dbProgress !== null && dbProgress < 1) {
      toast.error("Complete Round 1 first to unlock Round 2.");
      navigate("/", { replace: true });
    }
  }, [dbProgress, navigate]);

  const [questions, setQuestions] = useState<DebugQuestion[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);

  useEffect(() => {
    getDebugQuestions(doorNumber).then(qs => {
      setQuestions(qs);
      setQuestionStates(
        qs.map((q) => ({
          code: "",
          testCases: (q?.testCases ?? []).map((tc) => ({
            input: tc?.input ?? "",
            expectedOutput: tc?.expectedOutput ?? "",
            actualOutput: "",
            status: "pending" as TCStatus,
          })),
          score: 0,
          isRunning: false,
        }))
      );
      setQuestionsLoaded(true);
    });
  }, [doorNumber]);

  const handleStartChallenge = () => {
    if (!language) return;
    console.log("Starting challenge with language:", language, "Questions count:", questions.length);
    setQuestionStates(
      questions.map((q) => ({
        code: q?.buggyCode?.[language] || "",
        testCases: (q?.testCases ?? []).map((tc) => ({
          input: tc?.input ?? "",
          expectedOutput: tc?.expectedOutput ?? "",
          actualOutput: "",
          status: "pending" as TCStatus,
        })),
        score: 0,
        isRunning: false,
      }))
    );
    setHasStarted(true);
  };

  const handleCodeChange = (code: string) => {
    setQuestionStates((prev) => {
      const next = [...prev];
      next[currentQuestion] = { ...next[currentQuestion], code };
      return next;
    });
  };

  // ── Real Judge0 execution ──────────────────────────────────────────
  const handleRunTests = async () => {
    if (!language) return;
    const qIdx = currentQuestion;
    const state = questionStates[qIdx];

    // Mark all as running
    setQuestionStates((prev) => {
      const next = [...prev];
      next[qIdx] = {
        ...next[qIdx],
        isRunning: true,
        testCases: next[qIdx].testCases.map((tc) => ({
          ...tc,
          status: "running" as TCStatus,
          actualOutput: "",
          errorMessage: undefined,
          statusLabel: undefined,
        })),
      };
      return next;
    });

    const results = await Promise.all(
      state.testCases.map(async (tc) => {
        try {
          const codeToRun = buildCode(question, language, state.code, tc.input);
          const result = await runCode(language, codeToRun, "");
          const passed =
            !result.isError &&
            result.output.trim().toLowerCase() === tc.expectedOutput.trim().toLowerCase();
          return {
            actualOutput: result.output,
            status: (result.isError ? "error" : passed ? "passed" : "failed") as TCStatus,
            errorMessage: result.isError ? result.output : undefined,
            statusLabel: result.statusLabel,
          };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Network error";
          toast.error(msg);
          return {
            actualOutput: "",
            status: "error" as TCStatus,
            errorMessage: msg,
            statusLabel: "Network Error",
          };
        }
      })
    );

    setQuestionStates((prev) => {
      const next = [...prev];
      const tcs = next[qIdx].testCases.map((tc, i) => ({
        ...tc,
        actualOutput: results[i].actualOutput,
        status: results[i].status,
        errorMessage: results[i].errorMessage,
        statusLabel: results[i].statusLabel,
      }));
      const passedCount = tcs.filter((tc) => tc.status === "passed").length;
      const score = Math.round((passedCount / tcs.length) * 100);
      next[qIdx] = { ...next[qIdx], testCases: tcs, score, isRunning: false };
      return next;
    });
  };

  const passingGrade = gameState?.passingGrades?.[2] ?? 50;
  const HINT_PENALTY = 10;
  const alreadyCompleted = dbProgress !== null && dbProgress >= 2;

  const computeFinalScore = useCallback(() => {
    const rawSum = (questionStates ?? []).reduce((sum, q) => sum + (q?.score ?? 0), 0);
    const count = Math.max(questions.length, 1);
    const score = Math.round(rawSum / count) - (hintsUsed?.size ?? 0) * HINT_PENALTY;
    return isFinite(score) ? Math.max(0, score) : 0;
  }, [questionStates, questions.length, hintsUsed]);

  const saveProgress = useCallback(
    async (score: number) => {
      if (!userSession?.email) return;
      try {
        const passed = score >= passingGrade;
        const nextProgress = passed ? Math.max(dbProgress ?? 0, 2) : (dbProgress ?? 0);
        await updateUserScore(userSession.email, 2, score, nextProgress);
      } catch {
        toast.error("Failed to save progress.");
      }
    },
    [userSession, dbProgress, passingGrade]
  );

  const handleTimeUp = useCallback(() => {
    setShowTimeUpDialog(true);
    setIsSubmitted(true);
    toast.error("Time's up! Your debug challenge has been auto-submitted.");
    saveProgress(computeFinalScore());
  }, [computeFinalScore, saveProgress]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    toast.success("Debug challenge submitted!");
    saveProgress(computeFinalScore());
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedTestCase(0);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedTestCase(0);
      setShowHint(false);
    }
  };

  const totalScore = computeFinalScore();
  const passed = totalScore >= passingGrade;
  const question = questions[currentQuestion];
  const currentState = questionStates[currentQuestion];

  // ── Loading ────────────────────────────────────────────────────────
  if (!questionsLoaded || dbProgress === null || questions.length === 0)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-white/30 text-sm">{questionsLoaded && questions.length === 0 ? "No challenges found." : "Loading challenges…"}</p>
        </div>
      </div>
    );

  // Safety guard for rendering
  if (!question || !currentState) {
    if (questionsLoaded && questions.length > 0) {
      console.warn("Safety guard triggered: questions exist but state missing or out of sync.", {
        currentQuestion,
        questionsCount: questions.length,
        statesCount: questionStates.length
      });
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">State Synchronization Error</h2>
          <p className="text-muted-foreground mb-6">
            The arena couldn't sync with the current problem.
            Try refreshing or going back to the dashboard.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Arena</Button>
        </div>
      );
    }
    return null;
  }

  // ── Already completed ──────────────────────────────────────────────
  if (alreadyCompleted && !isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center">
          <Lock className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Already Completed</h2>
          <p className="text-muted-foreground mb-6">
            You've already submitted Round 2. Your score has been saved.
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // ── Language selection ─────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Round 2: Debug Arena
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Door {doorNumber} •{" "}
              {doorNumber === 1
                ? "Syntax Maze"
                : doorNumber === 2
                  ? "Logic Trap"
                  : "Runtime Rush"}
            </p>
            <p className="text-muted-foreground">
              Fix the bugs in 5 coding challenges.
              <br />
              You have 15 minutes. Score at least {passingGrade}% to advance.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Select Your Programming Language
            </h2>
            <LanguageSelector selected={language} onSelect={setLanguage} />
            <Button
              onClick={handleStartChallenge}
              disabled={!language}
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Start Debug Challenge
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main challenge UI ──────────────────────────────────────────────
  const selectedTc = currentState?.testCases[selectedTestCase];
  const anyRunning = currentState?.isRunning;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Round 2: Debug Arena
              </h1>
              <p className="text-sm text-muted-foreground">
                Door {doorNumber} • {language?.toUpperCase()}
              </p>
            </div>
          </div>
          {!isSubmitted && (
            <Timer
              initialMinutes={DEBUG_TIME_MINUTES}
              onTimeUp={handleTimeUp}
              storageKey={`debug_d${doorNumber}`}
            />
          )}
        </header>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Problem {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              This problem: {currentState.score}%
            </span>
          </div>
          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="h-2"
          />
        </div>

        {/* Problem navigation dots */}
        <div className="flex gap-2 mb-6">
          {questions.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to problem ${index + 1}`}
              onClick={() => {
                setCurrentQuestion(index);
                setSelectedTestCase(0);
                setShowHint(false);
              }}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                "flex items-center justify-center",
                currentQuestion === index &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background",
                (questionStates[index]?.score ?? 0) >= 100
                  ? "bg-chart-1/20 text-chart-1 border border-chart-1/30"
                  : (questionStates[index]?.score ?? 0) > 0
                    ? "bg-chart-3/20 text-chart-3 border border-chart-3/30"
                    : "bg-secondary text-muted-foreground border border-border"
              )}
            >
              {questionStates[index]?.isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Problem description + code editor */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {question.title}
              </h2>
              <p className="text-muted-foreground mb-4">{question.description}</p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const isRevealing = !showHint;
                  setShowHint(isRevealing);
                  if (isRevealing) {
                    setHintsUsed((prev) => new Set(prev).add(currentQuestion));
                  }
                }}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
                {!hintsUsed.has(currentQuestion) && (
                  <span className="text-xs text-muted-foreground/70 ml-1">
                    (-{HINT_PENALTY}%)
                  </span>
                )}
              </Button>

              {showHint && (
                <div className="mt-4 p-4 bg-chart-3/10 border border-chart-3/30 rounded-lg">
                  <p className="text-sm text-chart-3">{question.hint}</p>
                </div>
              )}
            </div>

            {/* Variable values info strip */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 flex items-start gap-3">
              <span className="text-xs font-semibold text-primary mt-0.5 shrink-0">Variables</span>
              <code className="text-xs text-foreground/80 font-mono break-all">
                {fillPreamble(
                  (question.inputPreamble as Record<string, string>)?.[language ?? "python"] ?? "",
                  currentState?.testCases[selectedTestCase]?.input ?? ""
                )}
              </code>
            </div>

            {/* Code editor */}
            <CodeEditor
              value={currentState.code}
              onChange={handleCodeChange}
              language={language || "python"}
              readOnly={isSubmitted}
              height="360px"
            />

            {/* Run button */}
            <Button
              onClick={handleRunTests}
              disabled={isSubmitted || anyRunning}
              className="w-full gap-2 bg-chart-1 hover:bg-chart-1/90 text-primary-foreground"
            >
              {anyRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running on Judge0…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Tests
                </>
              )}
            </Button>
          </div>

          {/* Right: Test case panel */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-border overflow-x-auto">
                {currentState?.testCases.map((tc, idx) => (
                  <button
                    key={idx}
                    aria-label={`Test case ${idx + 1}`}
                    onClick={() => setSelectedTestCase(idx)}
                    className={cn(
                      "px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors",
                      "border-r border-border last:border-r-0 whitespace-nowrap",
                      selectedTestCase === idx
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {tc.status === "pending" && (
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    )}
                    {tc.status === "running" && (
                      <Loader2 className="w-4 h-4 text-chart-3 animate-spin" />
                    )}
                    {tc.status === "passed" && (
                      <CheckCircle2 className="w-4 h-4 text-chart-1" />
                    )}
                    {(tc.status === "failed" || tc.status === "error") && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    Test {idx + 1}
                  </button>
                ))}
              </div>

              {/* Details */}
              {selectedTc && (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Input (stdin)
                    </p>
                    <pre className="p-3 bg-secondary rounded-lg text-sm font-mono text-foreground overflow-x-auto">
                      {selectedTc?.input || "(no input)"}
                    </pre>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Expected Output
                    </p>
                    <pre className="p-3 bg-secondary rounded-lg text-sm font-mono text-foreground overflow-x-auto">
                      {selectedTc?.expectedOutput}
                    </pre>
                  </div>

                  {selectedTc?.status !== "pending" && selectedTc?.status !== "running" && (
                    <div>
                      <p
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2",
                          selectedTc?.status === "passed"
                            ? "text-chart-1"
                            : "text-destructive"
                        )}
                      >
                        Your Output{" "}
                        {selectedTc?.status === "passed" ? "✓" : "✗"}
                        {selectedTc?.statusLabel && selectedTc?.status !== "passed" && (
                          <span className="font-normal normal-case text-[10px] px-1.5 py-0.5 bg-destructive/15 rounded">
                            {selectedTc?.statusLabel}
                          </span>
                        )}
                      </p>
                      <pre
                        className={cn(
                          "p-3 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap",
                          selectedTc?.status === "passed"
                            ? "bg-chart-1/10 text-chart-1 border border-chart-1/30"
                            : "bg-destructive/10 text-destructive border border-destructive/30"
                        )}
                      >
                        {selectedTc?.errorMessage ||
                          selectedTc?.actualOutput ||
                          "(no output)"}
                      </pre>
                    </div>
                  )}

                  {selectedTc?.status === "running" && (
                    <div className="flex items-center gap-3 p-3 bg-chart-3/10 border border-chart-3/30 rounded-lg">
                      <Clock className="w-4 h-4 text-chart-3 animate-pulse" />
                      <span className="text-sm text-chart-3">
                        Executing on Judge0 sandbox…
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Score for this problem */}
            {(currentState?.testCases ?? []).some(
              (tc) => tc.status !== "pending" && tc.status !== "running"
            ) && (
                <div
                  className={cn(
                    "p-4 rounded-xl border text-center",
                    currentState.score >= 100
                      ? "bg-chart-1/10 border-chart-1/30"
                      : currentState.score > 0
                        ? "bg-chart-3/10 border-chart-3/30"
                        : "bg-secondary border-border"
                  )}
                >
                  <p className="text-lg font-bold">
                    Problem Score:{" "}
                    <span
                      className={cn(
                        currentState.score >= 100
                          ? "text-chart-1"
                          : currentState.score > 0
                            ? "text-chart-3"
                            : "text-muted-foreground"
                      )}
                    >
                      {currentState.score}%
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentState.testCases.filter((tc) => tc.status === "passed").length} of{" "}
                    {currentState.testCases.length} test cases passed
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {!isSubmitted && (
            <Button
              variant="default"
              onClick={() => setShowSubmitDialog(true)}
              className="gap-2 bg-chart-4 hover:bg-chart-4/90 text-white"
            >
              <Flag className="w-4 h-4" />
              Submit Round
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Results card */}
        {isSubmitted && (
          <div
            className={cn(
              "mt-8 p-8 rounded-2xl border text-center",
              passed
                ? "bg-chart-1/10 border-chart-1/30"
                : "bg-destructive/10 border-destructive/30"
            )}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                passed ? "bg-chart-1/20" : "bg-destructive/20"
              )}
            >
              {passed ? (
                <CheckCircle2 className="w-8 h-8 text-chart-1" />
              ) : (
                <AlertCircle className="w-8 h-8 text-destructive" />
              )}
            </div>
            <h3
              className={cn(
                "text-2xl font-bold mb-2",
                passed ? "text-chart-1" : "text-destructive"
              )}
            >
              {passed ? "Well Done!" : "Keep Practicing"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Average Score: {totalScore}%
              {hintsUsed.size > 0 && (
                <span className="text-xs text-muted-foreground/60 ml-2">
                  (−{hintsUsed.size * HINT_PENALTY}% hint penalty applied)
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {passed
                ? "You've passed Round 2! Round 3 is now unlocked."
                : `You need at least ${passingGrade}% to advance.`}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              {passed && (
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/")}
                >
                  Continue to Round 3
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Debug Challenge?</DialogTitle>
            <DialogDescription>
              Your current average score is {totalScore}%. Make sure you've run
              tests on all problems before submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Debugging
            </Button>
            <Button onClick={handleSubmit}>Submit Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Time's Up!</DialogTitle>
            <DialogDescription>
              Your debug challenge has been automatically submitted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowTimeUpDialog(false)}>
              View Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
