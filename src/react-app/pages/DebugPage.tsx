import { useState, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import Timer from "@/react-app/components/Timer";
import CodeEditor from "@/react-app/components/CodeEditor";
import LanguageSelector, {
  type Language,
} from "@/react-app/components/LanguageSelector";
import TestCasePanel, {
  type TestCase,
} from "@/react-app/components/TestCasePanel";
import { getDebugQuestionsForDoor } from "@/react-app/data/debugQuestions";
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

const PASSING_PERCENTAGE = 50;
const DEBUG_TIME_MINUTES = 15;

export default function DebugPage() {
  const { door } = useParams();
  const navigate = useNavigate();
  const doorNumber = parseInt(door || "1");

  const [language, setLanguage] = useState<Language | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const userSession = getUserSession();
  const [dbProgress, setDbProgress] = useState(0);

  // Sync current progress from DB
  useEffect(() => {
    if (userSession?.email) {
      return subscribeToUser(userSession.email, (u) => {
        if (u) setDbProgress(u.roundsCompleted);
      });
    }
  }, [userSession]);

  const questions = getDebugQuestionsForDoor(doorNumber);

  // Track code and test results for each question
  const [questionStates, setQuestionStates] = useState<
    {
      code: string;
      testCases: TestCase[];
      score: number;
    }[]
  >(() =>
    questions.map((q) => ({
      code: language ? q.buggyCode[language] : "",
      testCases: q.testCases.map((tc, i) => ({
        id: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        status: "pending" as const,
      })),
      score: 0,
    }))
  );

  const [selectedTestCase, setSelectedTestCase] = useState(1);

  const handleStartChallenge = () => {
    if (!language) return;
    // Initialize code for all questions with selected language
    setQuestionStates(
      questions.map((q) => ({
        code: q.buggyCode[language],
        testCases: q.testCases.map((tc, i) => ({
          id: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          status: "pending" as const,
        })),
        score: 0,
      }))
    );
    setHasStarted(true);
  };

  const handleCodeChange = (code: string) => {
    setQuestionStates((prev) => {
      const newStates = [...prev];
      newStates[currentQuestion] = {
        ...newStates[currentQuestion],
        code,
      };
      return newStates;
    });
  };

  const handleRunTests = () => {
    // Simulate running tests (in production, this would call Judge0 API)
    setQuestionStates((prev) => {
      const newStates = [...prev];
      const currentState = newStates[currentQuestion];

      // Set all to running
      const runningTestCases = currentState.testCases.map((tc) => ({
        ...tc,
        status: "running" as const,
      }));
      newStates[currentQuestion] = {
        ...currentState,
        testCases: runningTestCases,
      };
      return newStates;
    });

    // Simulate async test execution
    setTimeout(() => {
      setQuestionStates((prev) => {
        const newStates = [...prev];
        const currentState = newStates[currentQuestion];

        // Randomly pass/fail tests for demo (in production, real execution)
        const testedCases = currentState.testCases.map((tc) => {
          const passed = Math.random() > 0.3; // 70% chance to pass for demo
          return {
            ...tc,
            status: passed ? ("passed" as const) : ("failed" as const),
            actualOutput: passed
              ? tc.expectedOutput
              : "Different output...",
          };
        });

        const passedCount = testedCases.filter(
          (tc) => tc.status === "passed"
        ).length;
        const score = Math.round(
          (passedCount / testedCases.length) * 100
        );

        newStates[currentQuestion] = {
          ...currentState,
          testCases: testedCases,
          score,
        };
        return newStates;
      });
    }, 1500);
  };

  const handleTimeUp = useCallback(() => {
    setShowTimeUpDialog(true);
    setIsSubmitted(true);
    toast.error("Time's up! Your debug challenge has been auto-submitted.");
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    toast.success("Debug challenge submitted! Check your results below.");
  };

  // Save progress and navigate to next round
  const handleContinueToRound3 = async () => {
    if (userSession?.email) {
      try {
        // Only increment if we haven't already marked round 2 as done
        const nextProgress = Math.max(dbProgress, 2);
        // Average score between current total and existing score
        await updateUserScore(userSession.email, totalScore, nextProgress);
        toast.success("Progress saved to database.");
      } catch (e) {
        toast.error("Failed to save progress to database.");
      }
    }
    navigate("/");
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedTestCase(1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedTestCase(1);
      setShowHint(false);
    }
  };

  // Apply hint penalty: -10% per unique hint revealed
  const HINT_PENALTY = 10;
  const totalScore = Math.max(
    0,
    Math.round(
      questionStates.reduce((sum, q) => sum + q.score, 0) / questions.length
    ) - hintsUsed.size * HINT_PENALTY
  );
  const passed = totalScore >= PASSING_PERCENTAGE;

  const question = questions[currentQuestion];
  const currentState = questionStates[currentQuestion];

  // Language selection screen
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
              Find and fix the bugs in 5 coding challenges.
              <br />
              You have 15 minutes. Score at least 50% to advance.
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

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
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
            <Timer initialMinutes={DEBUG_TIME_MINUTES} onTimeUp={handleTimeUp} />
          )}
        </header>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Problem {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Current Score: {currentState.score}%
            </span>
          </div>
          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="h-2"
          />
        </div>

        {/* Question navigation */}
        <div className="flex gap-2 mb-6">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestion(index);
                setSelectedTestCase(1);
                setShowHint(false);
              }}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                "flex items-center justify-center",
                currentQuestion === index &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background",
                questionStates[index].score >= 100
                  ? "bg-chart-1/20 text-chart-1 border border-chart-1/30"
                  : questionStates[index].score > 0
                    ? "bg-chart-3/20 text-chart-3 border border-chart-3/30"
                    : "bg-secondary text-muted-foreground border border-border"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Problem description and code editor */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {question.title}
              </h2>
              <p className="text-muted-foreground mb-4">
                {question.description}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const isRevealing = !showHint;
                  setShowHint(isRevealing);
                  if (isRevealing) {
                    setHintsUsed(prev => new Set(prev).add(currentQuestion));
                  }
                }}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
                {!hintsUsed.has(currentQuestion) && (
                  <span className="text-xs text-muted-foreground/70 ml-1">(-{10}%)</span>
                )}
              </Button>

              {showHint && (
                <div className="mt-4 p-4 bg-chart-3/10 border border-chart-3/30 rounded-lg">
                  <p className="text-sm text-chart-3">{question.hint}</p>
                </div>
              )}
            </div>

            <CodeEditor
              value={currentState.code}
              onChange={handleCodeChange}
              language={language || "python"}
              readOnly={isSubmitted}
              height="350px"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleRunTests}
                disabled={isSubmitted}
                className="flex-1 gap-2 bg-chart-1 hover:bg-chart-1/90 text-primary-foreground"
              >
                <Play className="w-4 h-4" />
                Run Tests
              </Button>
            </div>
          </div>

          {/* Right: Test cases */}
          <div className="space-y-4">
            <TestCasePanel
              testCases={currentState.testCases}
              selectedTestCase={selectedTestCase}
              onSelectTestCase={setSelectedTestCase}
            />

            {/* Score display */}
            {currentState.testCases.some((tc) => tc.status !== "pending") && (
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
                  Score:{" "}
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
                  {
                    currentState.testCases.filter((tc) => tc.status === "passed")
                      .length
                  }{" "}
                  of {currentState.testCases.length} tests passed
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

        {/* Results */}
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
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {passed
                ? "You've passed Round 2! Round 3 is now unlocked."
                : `You need at least ${PASSING_PERCENTAGE}% to advance.`}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              {passed && (
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleContinueToRound3}
                >
                  Continue to Round 3
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit dialog */}
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

      {/* Time up dialog */}
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
