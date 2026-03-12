import { memo, useDeferredValue } from "react";
import { cn } from "@/react-app/lib/utils";
import { CheckCircle2, XCircle, Loader2, Play } from "lucide-react";

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status: "pending" | "running" | "passed" | "failed";
}

interface TestCasePanelProps {
  testCases: TestCase[];
  selectedTestCase: number;
  onSelectTestCase: (id: number) => void;
}

/** Renders the heavy <pre> content with deferred priority so tab-switching stays responsive. */
const TestCaseDetails = memo(function TestCaseDetails({
  selected,
}: {
  selected: TestCase;
}) {
  // Defer expensive text layout until after the tab highlight paints
  const deferredInput = useDeferredValue(selected.input);
  const deferredExpected = useDeferredValue(selected.expectedOutput);
  const deferredActual = useDeferredValue(selected.actualOutput);

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Input
        </label>
        <pre className="mt-1 p-3 bg-secondary rounded-lg text-sm font-mono text-foreground overflow-x-auto">
          {deferredInput || "(no input)"}
        </pre>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Expected Output
        </label>
        <pre className="mt-1 p-3 bg-secondary rounded-lg text-sm font-mono text-foreground overflow-x-auto">
          {deferredExpected}
        </pre>
      </div>

      {deferredActual !== undefined && (
        <div>
          <label
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              selected.status === "passed"
                ? "text-chart-1"
                : "text-destructive"
            )}
          >
            Your Output
          </label>
          <pre
            className={cn(
              "mt-1 p-3 rounded-lg text-sm font-mono overflow-x-auto",
              selected.status === "passed"
                ? "bg-chart-1/10 text-chart-1 border border-chart-1/30"
                : "bg-destructive/10 text-destructive border border-destructive/30"
            )}
          >
            {deferredActual || "(no output)"}
          </pre>
        </div>
      )}
    </div>
  );
});

const TestCaseTab = memo(function TestCaseTab({
  tc,
  isSelected,
  onSelect,
}: {
  tc: TestCase;
  isSelected: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button
      onClick={() => onSelect(tc.id)}
      className={cn(
        "px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors",
        "border-r border-border last:border-r-0",
        "whitespace-nowrap",
        isSelected
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      {tc.status === "pending" && (
        <Play className="w-4 h-4 text-muted-foreground" />
      )}
      {tc.status === "running" && (
        <Loader2 className="w-4 h-4 text-chart-3 animate-spin" />
      )}
      {tc.status === "passed" && (
        <CheckCircle2 className="w-4 h-4 text-chart-1" />
      )}
      {tc.status === "failed" && (
        <XCircle className="w-4 h-4 text-destructive" />
      )}
      Test {tc.id}
    </button>
  );
});

export default memo(function TestCasePanel({
  testCases,
  selectedTestCase,
  onSelectTestCase,
}: TestCasePanelProps) {
  const selected = testCases.find((tc) => tc.id === selectedTestCase);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Test case tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {testCases.map((tc) => (
          <TestCaseTab
            key={tc.id}
            tc={tc}
            isSelected={selectedTestCase === tc.id}
            onSelect={onSelectTestCase}
          />
        ))}
      </div>

      {/* Test case details */}
      {selected && <TestCaseDetails selected={selected} />}
    </div>
  );
});
