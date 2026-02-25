import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const GAME_DOC = doc(db, "config", "gameState");

/** Start the game — updates Firestore, all browsers notified instantly */
export async function startGame(): Promise<void> {
    await setDoc(GAME_DOC, { started: true, startedAt: new Date().toISOString() });
}

/** Stop the game — resets to waiting room */
export async function stopGame(): Promise<void> {
    await setDoc(GAME_DOC, { started: false, stoppedAt: new Date().toISOString() });
}

/** Subscribe to real-time game state — call returned function to unsubscribe */
export function subscribeToGameState(callback: (started: boolean) => void): () => void {
    return onSnapshot(GAME_DOC, (snap) => {
        callback(snap.exists() ? (snap.data()?.started ?? false) : false);
    });
}

/** One-time check (async) — use subscribeToGameState for real-time */
export async function isGameStarted(): Promise<boolean> {
    const snap = await getDoc(GAME_DOC);
    return snap.exists() ? (snap.data()?.started ?? false) : false;
}
