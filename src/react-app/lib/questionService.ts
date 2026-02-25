import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { QuizQuestion } from "@/react-app/data/quizQuestions";
import type { DebugQuestion } from "@/react-app/data/debugQuestions";
import type { CodingQuestion } from "@/react-app/data/codingQuestions";

export type { QuizQuestion, DebugQuestion, CodingQuestion };
export type RoundType = "quiz" | "debug" | "coding";

// ── Document key helpers ───────────────────────────────────────────
function qKey(type: RoundType, door: number) {
    return doc(db, "questions", `${type}_door${door}`);
}

// ── Generic loaders (with bundled fallback) ────────────────────────
export async function getQuizQuestions(door: number): Promise<QuizQuestion[]> {
    try {
        const snap = await getDoc(qKey("quiz", door));
        if (snap.exists()) return snap.data().questions as QuizQuestion[];
    } catch { /* fall through to static */ }
    const { getQuestionsForDoor } = await import("@/react-app/data/quizQuestions");
    return getQuestionsForDoor(door);
}

export async function getDebugQuestions(door: number): Promise<DebugQuestion[]> {
    try {
        const snap = await getDoc(qKey("debug", door));
        if (snap.exists()) return snap.data().questions as DebugQuestion[];
    } catch { /* fall through to static */ }
    const { getDebugQuestionsForDoor } = await import("@/react-app/data/debugQuestions");
    return getDebugQuestionsForDoor(door);
}

export async function getCodingQuestions(door: number): Promise<CodingQuestion[]> {
    try {
        const snap = await getDoc(qKey("coding", door));
        if (snap.exists()) return snap.data().questions as CodingQuestion[];
    } catch { /* fall through to static */ }
    const { getCodingQuestionsForDoor } = await import("@/react-app/data/codingQuestions");
    return getCodingQuestionsForDoor(door);
}

// ── Admin CRUD ────────────────────────────────────────────────────
export async function saveQuestions(type: RoundType, door: number, questions: unknown[]): Promise<void> {
    await setDoc(qKey(type, door), { questions, updatedAt: new Date().toISOString() });
}

// ── Seeder — called once from admin Question Bank ─────────────────
export async function seedAllQuestionsIfEmpty(): Promise<{ seeded: number }> {
    const [
        { door1Questions, door2Questions, door3Questions },
        { door1DebugQuestions, door2DebugQuestions, door3DebugQuestions },
        { getCodingQuestionsForDoor },
    ] = await Promise.all([
        import("@/react-app/data/quizQuestions"),
        import("@/react-app/data/debugQuestions"),
        import("@/react-app/data/codingQuestions"),
    ]);

    const slots: { type: RoundType; door: number; data: unknown[] }[] = [
        { type: "quiz", door: 1, data: door1Questions },
        { type: "quiz", door: 2, data: door2Questions },
        { type: "quiz", door: 3, data: door3Questions },
        { type: "debug", door: 1, data: door1DebugQuestions },
        { type: "debug", door: 2, data: door2DebugQuestions },
        { type: "debug", door: 3, data: door3DebugQuestions },
        { type: "coding", door: 1, data: getCodingQuestionsForDoor(1) },
        { type: "coding", door: 2, data: getCodingQuestionsForDoor(2) },
        { type: "coding", door: 3, data: getCodingQuestionsForDoor(3) },
    ];

    let seeded = 0;
    await Promise.all(slots.map(async ({ type, door, data }) => {
        const snap = await getDoc(qKey(type, door));
        if (!snap.exists()) {
            await setDoc(qKey(type, door), { questions: data, updatedAt: new Date().toISOString() });
            seeded++;
        }
    }));
    return { seeded };
}

// ── Read all slots for admin ──────────────────────────────────────
export async function getAllQuestionsForAdmin(): Promise<Record<string, unknown[]>> {
    const keys: { type: RoundType; door: number }[] = [
        { type: "quiz", door: 1 }, { type: "quiz", door: 2 }, { type: "quiz", door: 3 },
        { type: "debug", door: 1 }, { type: "debug", door: 2 }, { type: "debug", door: 3 },
        { type: "coding", door: 1 }, { type: "coding", door: 2 }, { type: "coding", door: 3 },
    ];
    const results = await Promise.all(keys.map(async ({ type, door }) => {
        const snap = await getDoc(qKey(type, door));
        return { key: `${type}_door${door}`, questions: snap.exists() ? (snap.data().questions as unknown[]) : [] };
    }));
    return Object.fromEntries(results.map(r => [r.key, r.questions]));
}
