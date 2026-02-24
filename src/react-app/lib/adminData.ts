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
        { id: 1, name: "Arjun Sharma", email: "arjun@email.com", role: "participant", score: 97, roundsCompleted: 3, lastActive: "2024-02-24", status: "active" },
        { id: 2, name: "Priya Nair", email: "priya@email.com", role: "participant", score: 94, roundsCompleted: 3, lastActive: "2024-02-23", status: "active" },
        { id: 3, name: "Karthik R", email: "karthik@email.com", role: "participant", score: 91, roundsCompleted: 3, lastActive: "2024-02-24", status: "active" },
        { id: 4, name: "Dev Patel", email: "dev@email.com", role: "participant", score: 88, roundsCompleted: 3, lastActive: "2024-02-22", status: "active" },
        { id: 5, name: "Sneha Rao", email: "sneha@email.com", role: "participant", score: 85, roundsCompleted: 3, lastActive: "2024-02-20", status: "inactive" },
        { id: 6, name: "Rohan Kumar", email: "rohan@email.com", role: "participant", score: 79, roundsCompleted: 2, lastActive: "2024-02-19", status: "active" },
        { id: 7, name: "Ananya M", email: "ananya@email.com", role: "participant", score: 74, roundsCompleted: 2, lastActive: "2024-02-18", status: "inactive" },
        { id: 8, name: "Vikram S", email: "vikram@email.com", role: "participant", score: 68, roundsCompleted: 2, lastActive: "2024-02-24", status: "active" },
        { id: 9, name: "Meera J", email: "meera@email.com", role: "participant", score: 62, roundsCompleted: 1, lastActive: "2024-02-17", status: "inactive" },
        { id: 10, name: "Aditya B", email: "aditya@email.com", role: "participant", score: 55, roundsCompleted: 1, lastActive: "2024-02-16", status: "active" },
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
