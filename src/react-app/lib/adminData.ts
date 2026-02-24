// Stub in-memory user store — replace with real API when backend is ready

export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: "participant" | "admin";
    score: number;
    roundsCompleted: number;
    lastActive: string;
    status: "active" | "inactive";
}

let _nextId = 11;

const STORE_KEY = "adminUsers";

function defaultUsers(): AppUser[] {
    return [
        { id: 1, name: "Test User", email: "test@email.com", role: "participant", score: 0, roundsCompleted: 0, lastActive: "2024-02-24", status: "active" },
    ];
}

function load(): AppUser[] {
    try {
        const raw = localStorage.getItem(STORE_KEY);
        return raw ? (JSON.parse(raw) as AppUser[]) : defaultUsers();
    } catch {
        return defaultUsers();
    }
}

function save(users: AppUser[]): void {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(users));
    } catch { /* ignore */ }
}

export function getUsers(): AppUser[] {
    return load();
}

export function createUser(data: Omit<AppUser, "id">): AppUser {
    const users = load();
    const user: AppUser = { ...data, id: _nextId++ };
    save([...users, user]);
    return user;
}

export function updateUser(id: number, data: Partial<Omit<AppUser, "id">>): AppUser | null {
    const users = load();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    save(users);
    return users[idx];
}

export function deleteUser(id: number): boolean {
    const users = load();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    save(filtered);
    return true;
}
