import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    BookOpen, Bug, Code2, ChevronDown, ChevronUp, Plus, Trash2,
    Save, RefreshCw, Database, AlertCircle, CheckCircle2, Pencil, ArrowUp, ArrowDown,
} from "lucide-react";
import {
    getAllQuestionsForAdmin, saveQuestions, seedAllQuestionsIfEmpty,
    type QuizQuestion, type DebugQuestion, type CodingQuestion, type RoundType,
} from "@/react-app/lib/questionService";

// ── Tab config ──────────────────────────────────────────────────────────────
const ROUND_TABS: { type: RoundType; label: string; icon: React.ElementType; color: string }[] = [
    { type: "quiz", label: "Round 1 — Quiz", icon: BookOpen, color: "#8b5cf6" },
    { type: "debug", label: "Round 2 — Debug", icon: Bug, color: "#f59e0b" },
    { type: "coding", label: "Round 3 — Coding", icon: Code2, color: "#06b6d4" },
];

const DOOR_LABELS = ["Door 1", "Door 2", "Door 3"];

// ── Quiz Question Editor ────────────────────────────────────────────────────
function QuizEditor({ q, onChange }: { q: QuizQuestion; onChange: (q: QuizQuestion) => void }) {
    return (
        <div className="space-y-3">
            <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Question</label>
                <textarea
                    title="Question text"
                    placeholder="Enter the question…"
                    value={q.question}
                    rows={2}
                    onChange={e => onChange({ ...q, question: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500/50"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <button
                            title={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                            aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct answer`}
                            onClick={() => onChange({ ...q, correctAnswer: i })}
                            className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${q.correctAnswer === i ? "border-emerald-500 bg-emerald-500" : "border-white/20 hover:border-white/40"}`}
                        />
                        <input
                            title={`Option ${String.fromCharCode(65 + i)}`}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            value={opt}
                            onChange={e => {
                                const opts = [...q.options]; opts[i] = e.target.value;
                                onChange({ ...q, options: opts });
                            }}
                            className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                        />
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-white/25 uppercase tracking-wider">Click the circle to mark correct answer</p>
        </div>
    );
}

// ── Debug Question Editor ───────────────────────────────────────────────────
function DebugEditor({ q, onChange }: { q: DebugQuestion; onChange: (q: DebugQuestion) => void }) {
    const [lang, setLang] = useState<keyof DebugQuestion["buggyCode"]>("python");
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Title</label>
                    <input
                        title="Challenge title"
                        placeholder="e.g. Fix the Sum Function"
                        value={q.title}
                        onChange={e => onChange({ ...q, title: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                    />
                </div>
                <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Hint</label>
                    <input
                        title="Hint for participants"
                        placeholder="e.g. Check the arithmetic operator"
                        value={q.hint}
                        onChange={e => onChange({ ...q, hint: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                    />
                </div>
            </div>
            <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Description</label>
                <textarea
                    title="Challenge description"
                    placeholder="Describe what the code should do and what the bug is…"
                    value={q.description}
                    rows={2}
                    onChange={e => onChange({ ...q, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-amber-500/50"
                />
            </div>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-white/40 uppercase tracking-wider">Buggy Code</label>
                    <div className="flex gap-1">
                        {(Object.keys(q.buggyCode) as (keyof DebugQuestion["buggyCode"])[]).map(l => (
                            <button
                                key={l}
                                title={`Edit ${l} code`}
                                onClick={() => setLang(l)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${lang === l ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-white/30 hover:text-white/50"}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    title={`Buggy ${lang} code`}
                    placeholder={`Paste the buggy ${lang} code here…`}
                    value={q.buggyCode[lang]}
                    rows={6}
                    onChange={e => onChange({ ...q, buggyCode: { ...q.buggyCode, [lang]: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-green-300 text-xs font-mono resize-y focus:outline-none focus:border-amber-500/50"
                />
            </div>
            <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Test Cases (one per line: input | expectedOutput)</label>
                <textarea
                    title="Test cases"
                    placeholder="5, 3 | 8&#10;10, 20 | 30"
                    rows={3}
                    value={q.testCases.map(t => `${t.input} | ${t.expectedOutput}`).join("\n")}
                    onChange={e => {
                        const cases = e.target.value.split("\n").map(line => {
                            const [input, expectedOutput] = line.split(" | ");
                            return { input: input?.trim() || "", expectedOutput: expectedOutput?.trim() || "" };
                        });
                        onChange({ ...q, testCases: cases });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono resize-none focus:outline-none focus:border-amber-500/50"
                />
            </div>
        </div>
    );
}

// ── Coding Question Editor ──────────────────────────────────────────────────
function CodingEditor({ q, onChange }: { q: CodingQuestion; onChange: (q: CodingQuestion) => void }) {
    const [lang, setLang] = useState<keyof CodingQuestion["starterCode"]>("python");
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Title</label>
                    <input
                        title="Problem title"
                        placeholder="e.g. Two Sum"
                        value={q.title}
                        onChange={e => onChange({ ...q, title: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
                <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Difficulty</label>
                    <select
                        title="Difficulty level"
                        aria-label="Difficulty level"
                        value={q.difficulty}
                        onChange={e => onChange({ ...q, difficulty: e.target.value as CodingQuestion["difficulty"] })}
                        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    >
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Description</label>
                <textarea
                    title="Problem description"
                    placeholder="Describe the problem statement…"
                    value={q.description}
                    rows={3}
                    onChange={e => onChange({ ...q, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Constraints (one per line)</label>
                    <textarea
                        title="Constraints"
                        placeholder="2 ≤ nums.length ≤ 10⁴"
                        rows={3}
                        value={q.constraints.join("\n")}
                        onChange={e => onChange({ ...q, constraints: e.target.value.split("\n") })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none font-mono focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
                <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Test Cases (input | expected, one per line)</label>
                    <textarea
                        title="Test cases"
                        placeholder="[2,7,11,15]&#10;9 | [0,1]"
                        rows={3}
                        value={q.testCases.map(t => `${t.input} | ${t.expectedOutput}`).join("\n")}
                        onChange={e => {
                            const cases = e.target.value.split("\n").map(line => {
                                const [input, expectedOutput] = line.split(" | ");
                                return { input: input?.trim() || "", expectedOutput: expectedOutput?.trim() || "" };
                            });
                            onChange({ ...q, testCases: cases });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none font-mono focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-white/40 uppercase tracking-wider">Starter Code</label>
                    <div className="flex gap-1">
                        {(Object.keys(q.starterCode) as (keyof CodingQuestion["starterCode"])[]).map(l => (
                            <button
                                key={l}
                                title={`Edit ${l} starter code`}
                                onClick={() => setLang(l)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${lang === l ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-white/30 hover:text-white/50"}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    title={`${lang} starter code`}
                    placeholder={`Paste the ${lang} starter code here…`}
                    value={q.starterCode[lang]}
                    rows={8}
                    onChange={e => onChange({ ...q, starterCode: { ...q.starterCode, [lang]: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-green-300 text-xs font-mono resize-y focus:outline-none focus:border-cyan-500/50"
                />
            </div>
        </div>
    );
}

// ── Question Row (collapsible) ──────────────────────────────────────────────
function QuestionRow({ index, total, type, question, onChange, onDelete, onMove }: {
    index: number;
    total: number;
    type: RoundType;
    question: QuizQuestion | DebugQuestion | CodingQuestion;
    onChange: (q: typeof question) => void;
    onDelete: () => void;
    onMove: (dir: -1 | 1) => void;
}) {
    const [open, setOpen] = useState(false);
    const color = type === "quiz" ? "violet" : type === "debug" ? "amber" : "cyan";
    const borderColor = `border-${color}-500/20`;

    const title = type === "quiz"
        ? (question as QuizQuestion).question.slice(0, 60) + ((question as QuizQuestion).question.length > 60 ? "…" : "")
        : (question as DebugQuestion).title || "New Question";

    return (
        <div className={`rounded-xl border ${borderColor} bg-white/2 overflow-hidden`}>
            <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-white/20 text-xs font-bold w-5 shrink-0">#{index + 1}</span>
                <button
                    title={open ? "Collapse question" : "Expand question"}
                    onClick={() => setOpen(!open)}
                    className="flex-1 text-left flex items-center gap-2 min-w-0"
                >
                    {open ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                    <span className="text-white/80 text-sm truncate">{title}</span>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        title="Move question up"
                        aria-label="Move question up"
                        onClick={() => onMove(-1)}
                        disabled={index === 0}
                        className="p-1 rounded text-white/20 hover:text-white/50 disabled:opacity-30 transition-colors"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                        title="Move question down"
                        aria-label="Move question down"
                        onClick={() => onMove(1)}
                        disabled={index === total - 1}
                        className="p-1 rounded text-white/20 hover:text-white/50 disabled:opacity-30 transition-colors"
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                        title="Edit question"
                        aria-label="Edit question"
                        onClick={() => setOpen(!open)}
                        className="p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        title="Delete question"
                        aria-label="Delete question"
                        onClick={onDelete}
                        className="p-1 rounded text-red-400/40 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            {open && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    {type === "quiz" && <QuizEditor q={question as QuizQuestion} onChange={onChange as (q: QuizQuestion) => void} />}
                    {type === "debug" && <DebugEditor q={question as DebugQuestion} onChange={onChange as (q: DebugQuestion) => void} />}
                    {type === "coding" && <CodingEditor q={question as CodingQuestion} onChange={onChange as (q: CodingQuestion) => void} />}
                </div>
            )}
        </div>
    );
}

// ── Default new question factories ─────────────────────────────────────────
function newQuizQuestion(id: number): QuizQuestion {
    return { id, question: "", options: ["", "", "", ""], correctAnswer: 0 };
}
function newDebugQuestion(id: number): DebugQuestion {
    return {
        id, title: "New Debug Challenge", description: "", hint: "",
        buggyCode: { python: "", javascript: "", java: "", c: "", cpp: "" },
        testCases: [{ input: "", expectedOutput: "" }],
    };
}
function newCodingQuestion(id: number): CodingQuestion {
    return {
        id, title: "New Problem", difficulty: "Easy", description: "",
        examples: [{ input: "", output: "" }], constraints: [],
        starterCode: { python: "", javascript: "", java: "", c: "", cpp: "" },
        testCases: [{ input: "", expectedOutput: "" }],
    };
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function QuestionBank() {
    const [activeType, setActiveType] = useState<RoundType>("quiz");
    const [activeDoor, setActiveDoor] = useState(1);
    const [allData, setAllData] = useState<Record<string, unknown[]>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [dirty, setDirty] = useState(false);

    const currentKey = `${activeType}_door${activeDoor}`;
    const currentQuestions = (allData[currentKey] || []) as (QuizQuestion | DebugQuestion | CodingQuestion)[];

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllQuestionsForAdmin();
            setAllData(data);
            setDirty(false);
        } catch {
            toast.error("Failed to load questions from Firestore.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const updateQuestions = (questions: (QuizQuestion | DebugQuestion | CodingQuestion)[]) => {
        setAllData(prev => ({ ...prev, [currentKey]: questions }));
        setDirty(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveQuestions(activeType, activeDoor, currentQuestions);
            toast.success(`Saved ${currentQuestions.length} questions for ${DOOR_LABELS[activeDoor - 1]}!`);
            setDirty(false);
        } catch {
            toast.error("Failed to save questions.");
        } finally {
            setSaving(false);
        }
    };

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const { seeded } = await seedAllQuestionsIfEmpty();
            if (seeded === 0) {
                toast.info("All question banks already have data. No seeding needed.");
            } else {
                toast.success(`Seeded ${seeded} question slot(s) from bundled questions!`);
            }
            await load();
        } catch {
            toast.error("Seeding failed.");
        } finally {
            setSeeding(false);
        }
    };

    const addQuestion = () => {
        const nextId = currentQuestions.length + 1;
        const blank =
            activeType === "quiz" ? newQuizQuestion(nextId) :
                activeType === "debug" ? newDebugQuestion(nextId) :
                    newCodingQuestion(nextId);
        updateQuestions([...currentQuestions, blank]);
    };

    const deleteQuestion = (i: number) => {
        updateQuestions(currentQuestions.filter((_, idx) => idx !== i));
    };

    const moveQuestion = (i: number, dir: -1 | 1) => {
        const arr = [...currentQuestions];
        const j = i + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        updateQuestions(arr);
    };

    const tab = ROUND_TABS.find(t => t.type === activeType)!;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-white text-xl font-bold">Question Bank</h2>
                    <p className="text-white/30 text-sm mt-0.5">Manage all exam questions stored in Firestore</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSeed}
                        disabled={seeding || loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <Database className="w-4 h-4" />
                        {seeding ? "Seeding…" : "Seed from Bundled"}
                    </button>
                    <button
                        onClick={load}
                        disabled={loading}
                        title="Reload questions from Firestore"
                        aria-label="Reload questions from Firestore"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-white/40 hover:text-white transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!dirty || saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Unsaved badge */}
            {dirty && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <p className="text-amber-300 text-sm">You have unsaved changes. Click <strong>Save Changes</strong> to persist to Firestore.</p>
                </div>
            )}

            {/* Round type tabs */}
            <div className="flex gap-2 flex-wrap">
                {ROUND_TABS.map(({ type, label, icon: Icon }) => (
                    <button
                        key={type}
                        onClick={() => { setActiveType(type); setDirty(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${activeType === type
                            ? type === "quiz" ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                                : type === "debug" ? "bg-amber-500/15  border-amber-500/40  text-amber-300"
                                    : "bg-cyan-500/15   border-cyan-500/40   text-cyan-300"
                            : "bg-white/3 border-white/10 text-white/40 hover:text-white/60 hover:bg-white/5"}`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Door sub-tabs */}
            <div className="flex gap-1">
                {DOOR_LABELS.map((label, i) => {
                    const k = `${activeType}_door${i + 1}`;
                    const count = (allData[k] || []).length;
                    return (
                        <button
                            key={i}
                            onClick={() => setActiveDoor(i + 1)}
                            className={`flex-1 flex flex-col items-center gap-0.5 py-3 rounded-xl border text-sm transition-all ${activeDoor === i + 1
                                ? "bg-white/8 border-white/20 text-white"
                                : "bg-white/2 border-white/5 text-white/40 hover:text-white/60 hover:bg-white/5"}`}
                        >
                            <span className="font-semibold">{label}</span>
                            <span className="text-[10px] opacity-60">{count} question{count !== 1 ? "s" : ""}</span>
                        </button>
                    );
                })}
            </div>

            {/* Questions list */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex gap-2 items-center text-white/20">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading from Firestore…</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Summary bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <tab.icon className="w-4 h-4 text-white/30" />
                            <span className="text-white/50 text-sm">{currentQuestions.length} question{currentQuestions.length !== 1 ? "s" : ""} in this slot</span>
                        </div>
                        {currentQuestions.length === 0 && (
                            <div className="flex items-center gap-2 text-white/20">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs">Empty — click "+ Add" or "Seed from Bundled" to populate</span>
                            </div>
                        )}
                    </div>

                    {/* Question rows */}
                    {currentQuestions.map((q, i) => (
                        <QuestionRow
                            key={i}
                            index={i}
                            total={currentQuestions.length}
                            type={activeType}
                            question={q}
                            onChange={updated => {
                                const arr = [...currentQuestions];
                                arr[i] = updated;
                                updateQuestions(arr);
                            }}
                            onDelete={() => deleteQuestion(i)}
                            onMove={(dir) => moveQuestion(i, dir)}
                        />
                    ))}

                    {/* Add button */}
                    <button
                        onClick={addQuestion}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 text-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Question
                    </button>
                </div>
            )}
        </div>
    );
}
