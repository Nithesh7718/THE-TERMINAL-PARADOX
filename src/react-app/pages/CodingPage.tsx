import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
    ChevronLeft,
    ChevronRight,
    Flag,
    Play,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    BookOpen,
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
import { getCodingQuestionsForDoor } from "@/react-app/data/codingQuestions";
import { cn } from "@/react-app/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/react-app/components/ui/dialog";

const PASSING_PERCENTAGE = 50;
const CODING_TIME_MINUTES = 30;

export default function CodingPage() {
    const { door } = useParams();
    const navigate = useNavigate();
    const doorNumber = parseInt(door || "1");

    const [language, setLanguage] = useState<Language | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showProblem, setShowProblem] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

    const questions = getCodingQuestionsForDoor(doorNumber);

    const [questionStates, setQuestionStates] = useState<
        { code: string; testCases: TestCase[]; score: number }[]
    >(() =>
        questions.map((q) => ({
            code: "",
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
        setQuestionStates(
            questions.map((q) => ({
                code: q.starterCode[language] ?? "",
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
            newStates[currentQuestion] = { ...newStates[currentQuestion], code };
            return newStates;
        });
    };

    const handleRunTests = () => {
        setQuestionStates((prev) => {
            const newStates = [...prev];
            newStates[currentQuestion] = {
                ...newStates[currentQuestion],
                testCases: newStates[currentQuestion].testCases.map((tc) => ({
                    ...tc,
                    status: "running" as const,
                })),
            };
            return newStates;
        });

        setTimeout(() => {
            setQuestionStates((prev) => {
                const newStates = [...prev];
                const current = newStates[currentQuestion];
                const testedCases = current.testCases.map((tc) => {
                    const passed = Math.random() > 0.3;
                    return {
                        ...tc,
                        status: passed ? ("passed" as const) : ("failed" as const),
                        actualOutput: passed ? tc.expectedOutput : "Different output...",
                    };
                });
                const passedCount = testedCases.filter(
                    (tc) => tc.status === "passed"
                ).length;
                newStates[currentQuestion] = {
                    ...current,
                    testCases: testedCases,
                    score: Math.round((passedCount / testedCases.length) * 100),
                };
                return newStates;
            });
        }, 1800);
    };

    const handleTimeUp = useCallback(() => {
        setShowTimeUpDialog(true);
        setIsSubmitted(true);
    }, []);

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowSubmitDialog(false);
    };

    const handleContinueHome = () => {
        try {
            const current = parseInt(
                localStorage.getItem("completedRound") || "0",
                10
            );
            if (current < 3) localStorage.setItem("completedRound", "3");
        } catch {
            /* ignore */
        }
        navigate("/");
    };

    const totalScore = Math.round(
        questionStates.reduce((sum, q) => sum + q.score, 0) / questions.length
    );
    const passed = totalScore >= PASSING_PERCENTAGE;
    const question = questions[currentQuestion];
    const currentState = questionStates[currentQuestion];
    const doorNames = ["Array Forge", "String Sanctum", "Graph Gateway"];

    // Language selection screen
    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-background">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-chart-5/10 rounded-full blur-3xl animate-pulse" />
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
                            Round 3: Coding Conquest
                        </h1>
                        <p className="text-lg text-muted-foreground mb-2">
                            Door {doorNumber} • {doorNames[doorNumber - 1]}
                        </p>
                        <p className="text-muted-foreground">
                            Solve {questions.length} implementation challenges.
                            <br />
                            You have 30 minutes. Score at least 50% to conquer.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            Problems in this door
                        </h2>
                        <div className="space-y-3 mb-8">
                            {questions.map((q, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                                >
                                    <span className="text-sm font-medium text-foreground">
                                        {i + 1}. {q.title}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                                            q.difficulty === "Easy" &&
                                            "bg-chart-1/20 text-chart-1",
                                            q.difficulty === "Medium" &&
                                            "bg-chart-3/20 text-chart-3",
                                            q.difficulty === "Hard" && "bg-destructive/20 text-destructive"
                                        )}
                                    >
                                        {q.difficulty}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-xl font-semibold text-foreground mb-6">
                            Select Your Programming Language
                        </h2>
                        <LanguageSelector selected={language} onSelect={setLanguage} />

                        <Button
                            onClick={handleStartChallenge}
                            disabled={!language}
                            className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="lg"
                        >
                            Start Coding Challenge
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-chart-5/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
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
                                Round 3: Coding Conquest
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Door {doorNumber} • {language?.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    {!isSubmitted && (
                        <Timer
                            initialMinutes={CODING_TIME_MINUTES}
                            onTimeUp={handleTimeUp}
                        />
                    )}
                </header>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                            Problem {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Score: {currentState.score}%
                        </span>
                    </div>
                    <Progress
                        value={((currentQuestion + 1) / questions.length) * 100}
                        className="h-2"
                    />
                </div>

                {/* Question nav */}
                <div className="flex gap-2 mb-4">
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentQuestion(index);
                                setSelectedTestCase(1);
                                setShowProblem(true);
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                currentQuestion === index &&
                                "ring-2 ring-primary ring-offset-2 ring-offset-background",
                                questionStates[index].score >= 100
                                    ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                                    : questionStates[index].score > 0
                                        ? "bg-chart-3/20 text-chart-3 border-chart-3/30"
                                        : "bg-secondary text-muted-foreground border-border"
                            )}
                        >
                            {index + 1}. {questions[index].title}
                        </button>
                    ))}
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* Left: Problem + Editor */}
                    <div className="space-y-4">
                        {/* Problem toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowProblem(!showProblem)}
                            className="gap-2 w-full justify-start"
                        >
                            <BookOpen className="w-4 h-4" />
                            {showProblem ? "Hide" : "Show"} Problem Statement
                        </Button>

                        {showProblem && (
                            <div className="bg-card border border-border rounded-xl p-6 max-h-[380px] overflow-y-auto">
                                <div className="flex items-start justify-between mb-3">
                                    <h2 className="text-xl font-bold text-foreground">
                                        {question.title}
                                    </h2>
                                    <span
                                        className={cn(
                                            "text-xs font-semibold px-2 py-1 rounded-full ml-3 shrink-0",
                                            question.difficulty === "Easy" &&
                                            "bg-chart-1/20 text-chart-1",
                                            question.difficulty === "Medium" &&
                                            "bg-chart-3/20 text-chart-3",
                                            question.difficulty === "Hard" &&
                                            "bg-destructive/20 text-destructive"
                                        )}
                                    >
                                        {question.difficulty}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4 whitespace-pre-line">
                                    {question.description}
                                </p>

                                <div className="space-y-3 mb-4">
                                    {question.examples.map((ex, i) => (
                                        <div
                                            key={i}
                                            className="text-sm bg-secondary/50 rounded-lg p-3"
                                        >
                                            <p className="font-medium text-foreground mb-1">
                                                Example {i + 1}:
                                            </p>
                                            <p className="text-muted-foreground font-mono text-xs">
                                                Input: {ex.input}
                                            </p>
                                            <p className="text-muted-foreground font-mono text-xs">
                                                Output: {ex.output}
                                            </p>
                                            {ex.explanation && (
                                                <p className="text-muted-foreground text-xs mt-1">
                                                    {ex.explanation}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-foreground mb-2">
                                        Constraints:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {question.constraints.map((c, i) => (
                                            <li
                                                key={i}
                                                className="text-xs text-muted-foreground font-mono"
                                            >
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <CodeEditor
                            value={currentState.code}
                            onChange={handleCodeChange}
                            language={language || "python"}
                            readOnly={isSubmitted}
                            height={showProblem ? "280px" : "480px"}
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
                                        currentState.testCases.filter(
                                            (tc) => tc.status === "passed"
                                        ).length
                                    }{" "}
                                    of {currentState.testCases.length} tests passed
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setCurrentQuestion((p) => Math.max(0, p - 1));
                            setSelectedTestCase(1);
                        }}
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
                            className="gap-2 bg-chart-5 hover:bg-chart-5/90 text-white"
                        >
                            <Flag className="w-4 h-4" />
                            Submit Round
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => {
                            setCurrentQuestion((p) =>
                                Math.min(questions.length - 1, p + 1)
                            );
                            setSelectedTestCase(1);
                        }}
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
                            {passed ? "You're a Champion!" : "Keep Grinding"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Average Score: {totalScore}%
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            {passed
                                ? "Outstanding! You've conquered all three rounds of The Terminal Paradox!"
                                : `You need at least ${PASSING_PERCENTAGE}% to conquer this round.`}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => navigate("/")}>
                                Back to Home
                            </Button>
                            {passed && (
                                <Button
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={handleContinueHome}
                                >
                                    🏆 View Leaderboard
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
                        <DialogTitle>Submit Coding Challenge?</DialogTitle>
                        <DialogDescription>
                            Your current average score is {totalScore}%. Make sure you've run
                            tests on all problems before submitting.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmitDialog(false)}
                        >
                            Keep Coding
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
                            Your coding challenge has been automatically submitted.
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
