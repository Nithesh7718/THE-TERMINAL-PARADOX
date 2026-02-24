import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import Timer from "@/react-app/components/Timer";
import QuizOption from "@/react-app/components/QuizOption";
import { getQuestionsForDoor } from "@/react-app/data/quizQuestions";
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
const QUIZ_TIME_MINUTES = 15;

export default function QuizPage() {
  const { door } = useParams();
  const navigate = useNavigate();
  const doorNumber = parseInt(door || "1");

  const questions = getQuestionsForDoor(doorNumber);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTimeUp = useCallback(() => {
    setShowTimeUpDialog(true);
    setIsSubmitted(true);
    toast.error("Time's up! Your quiz has been auto-submitted.");
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitDialog(false);
    toast.success("Quiz submitted! Scroll down to see your results.");
  };

  // Save progress and navigate to next round
  const handleContinueToRound2 = () => {
    try {
      const current = parseInt(localStorage.getItem("completedRound") || "0", 10);
      if (current < 1) localStorage.setItem("completedRound", "1");
    } catch {/* ignore */ }
    navigate("/");
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= PASSING_PERCENTAGE;

  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  const question = questions[currentQuestion];
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-chart-3/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
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
                Round 1: Quiz Challenge
              </h1>
              <p className="text-sm text-muted-foreground">
                Door {doorNumber} •{" "}
                {doorNumber === 1
                  ? "Logic Gate"
                  : doorNumber === 2
                    ? "Algorithm Alley"
                    : "System Path"}
              </p>
            </div>
          </div>
          {!isSubmitted && (
            <Timer
              initialMinutes={QUIZ_TIME_MINUTES}
              onTimeUp={handleTimeUp}
            />
          )}
        </header>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {answeredCount} of {questions.length} answered
            </span>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question navigation dots */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              aria-label={`Go to question ${index + 1}${answers[index] !== null ? ' (answered)' : ' (unanswered)'}`}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                "flex items-center justify-center",
                currentQuestion === index && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                answers[index] !== null
                  ? isSubmitted
                    ? answers[index] === questions[index].correctAnswer
                      ? "bg-chart-1/20 text-chart-1 border border-chart-1/30"
                      : "bg-destructive/20 text-destructive border border-destructive/30"
                    : "bg-primary/20 text-primary border border-primary/30"
                  : "bg-secondary text-muted-foreground border border-border"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              {currentQuestion + 1}
            </div>
            <h2 className="text-xl font-semibold text-foreground flex-1">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <QuizOption
                key={index}
                label={optionLabels[index]}
                text={option}
                isSelected={answers[currentQuestion] === index}
                isCorrect={index === question.correctAnswer}
                isRevealed={isSubmitted}
                onClick={() => handleSelectAnswer(index)}
                disabled={isSubmitted}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
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
              className="gap-2 bg-chart-3 hover:bg-chart-3/90 text-primary-foreground"
            >
              <Flag className="w-4 h-4" />
              Submit Quiz
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

        {/* Results card (shown after submission) */}
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
              {passed ? "Congratulations!" : "Not Quite There"}
            </h3>
            <p className="text-muted-foreground mb-4">
              You scored {score} out of {questions.length} ({percentage}%)
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {passed
                ? "You've passed Round 1! Round 2 is now unlocked."
                : `You need at least ${PASSING_PERCENTAGE}% to advance. Keep practicing!`}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              {passed && (
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleContinueToRound2}
                >
                  Continue to Round 2
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              You've answered {answeredCount} of {questions.length} questions.
              {answeredCount < questions.length && (
                <span className="block mt-2 text-chart-3">
                  Warning: You have {questions.length - answeredCount} unanswered
                  questions.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Quiz
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
              Your quiz has been automatically submitted. Review your results
              below.
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
