// Admin auth utilities — localStorage-based for now (replace with real backend auth)

export type AdminRole = "admin" | "user";

export interface AdminSession {
    username: string;
    role: AdminRole;
    loginTime: number;
}

const SESSION_KEY = "adminSession";

const CREDENTIALS: Record<string, { password: string; role: AdminRole }> = {
    admin: { password: "admin@tp2024", role: "admin" },
    moderator: { password: "mod@tp2024", role: "user" },
};

export function login(username: string, password: string): AdminSession | null {
    const cred = CREDENTIALS[username.toLowerCase()];
    if (!cred || cred.password !== password) return null;
    const session: AdminSession = { username, role: cred.role, loginTime: Date.now() };
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch { /* ignore */ }
    return session;
}

export function logout(): void {
    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
}

export function getSession(): AdminSession | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw) as AdminSession;
        // Expire after 2 hours
        if (Date.now() - session.loginTime > 2 * 60 * 60 * 1000) {
            logout();
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

export function isAdmin(): boolean {
    return getSession()?.role === "admin";
}
