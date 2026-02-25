import { doc, setDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const GAME_DOC = doc(db, "config", "gameState");

/** Start the game — updates Firestore, all browsers notified instantly */
export async function startGame(): Promise<void> {
    const snap = await getDoc(GAME_DOC);
    if (!snap.exists()) {
        await setDoc(GAME_DOC, { started: true, startedAt: new Date().toISOString(), activeRound: 1, broadcastMessage: "" });
    } else {
        await updateDoc(GAME_DOC, { started: true, startedAt: new Date().toISOString() });
    }
}

/** Stop the game — resets to waiting room */
export async function stopGame(): Promise<void> {
    await updateDoc(GAME_DOC, { started: false, stoppedAt: new Date().toISOString() });
}

/** Set a broadcast message for all participants */
export async function sendBroadcast(message: string): Promise<void> {
    await updateDoc(GAME_DOC, { broadcastMessage: message, broadcastAt: new Date().toISOString() });
}

/** Set the currently active round for everyone */
export async function setActiveRound(round: number): Promise<void> {
    await updateDoc(GAME_DOC, { activeRound: round });
}

export interface GameState {
    started: boolean;
    broadcastMessage?: string;
    activeRound?: number;
}

/** Subscribe to real-time game state — call returned function to unsubscribe */
export function subscribeToGameState(callback: (state: GameState) => void): () => void {
    return onSnapshot(GAME_DOC, (snap) => {
        const d = snap.data();
        callback({
            started: d?.started ?? false,
            broadcastMessage: d?.broadcastMessage || "",
            activeRound: d?.activeRound ?? 1
        });
    });
}

/** One-time check (async) — use subscribeToGameState for real-time */
export async function getGameState(): Promise<GameState> {
    const snap = await getDoc(GAME_DOC);
    const d = snap.data();
    return {
        started: d?.started ?? false,
        broadcastMessage: d?.broadcastMessage || "",
        activeRound: d?.activeRound ?? 1
    };
}
