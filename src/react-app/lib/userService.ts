import {
    collection, doc, setDoc, getDoc, updateDoc,
    onSnapshot, query, orderBy, serverTimestamp,
    where, getDocs
} from "firebase/firestore";
import { db } from "./firebase";

export interface FSUser {
    id: string;          // email used as doc ID (sanitised)
    name: string;
    email: string;
    password: string;    // plain for this demo — hash in production
    score: number;
    roundsCompleted: number;
    lastActive: string;
    status: "active" | "inactive";
    role: "participant";
    createdAt?: unknown;
}

const USERS_COL = collection(db, "users");

// Sanitise email → valid Firestore doc ID (must be consistent everywhere)
function emailToId(email: string) {
    if (!email) return "";
    return email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
}

/** Register a new participant */
export async function registerUser(name: string, email: string, password: string): Promise<void> {
    const id = emailToId(email);
    const ref = doc(USERS_COL, id);
    const existing = await getDoc(ref);
    if (existing.exists()) throw new Error("Account already exists. Sign in instead.");
    await setDoc(ref, {
        id, name, email, password,
        score: 0, roundsCompleted: 0,
        lastActive: new Date().toISOString(),
        status: "active",
        role: "participant",
        createdAt: serverTimestamp(),
    });
}

/** Validate login credentials */
export async function loginUser(email: string, password: string): Promise<FSUser> {
    const id = emailToId(email);
    let ref = doc(USERS_COL, id);
    let snap = await getDoc(ref);

    // If not found by direct ID (sanitised), try a more robust query on the 'email' field
    if (!snap.exists()) {
        const q = query(USERS_COL, where("email", "==", email.trim().toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            snap = querySnap.docs[0];
            ref = snap.ref; // Use the actual ref for updating
        }
    }

    if (!snap.exists()) throw new Error("No account found. Please register.");
    const user = snap.data() as FSUser;
    if (user.password !== password) throw new Error("Incorrect password.");
    // Update last active + status
    await updateDoc(ref, { lastActive: new Date().toISOString(), status: "active" });
    return user;
}

/** Update a participant's score and progress */
export async function updateUserScore(
    email: string,
    score: number,
    roundsCompleted: number,
): Promise<void> {
    const ref = doc(USERS_COL, emailToId(email));
    await updateDoc(ref, {
        score,
        roundsCompleted,
        lastActive: new Date().toISOString(),
    });
}

/** Mark user as inactive on sign-out */
export async function markUserInactive(email: string): Promise<void> {
    try {
        const ref = doc(USERS_COL, emailToId(email));
        await updateDoc(ref, { status: "inactive" });
    } catch { /* ignore */ }
}

/** Subscribe to real-time user list (admin only) */
export function subscribeToUsers(callback: (users: FSUser[]) => void): () => void {
    const q = query(USERS_COL, orderBy("score", "desc"));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => d.data() as FSUser));
    });
}

/** Subscribe to a single user's data in real-time */
export function subscribeToUser(email: string, callback: (user: FSUser | null) => void): () => void {
    const id = emailToId(email);
    const ref = doc(USERS_COL, id);
    return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
            callback(snap.data() as FSUser);
        } else {
            callback(null);
        }
    });
}
