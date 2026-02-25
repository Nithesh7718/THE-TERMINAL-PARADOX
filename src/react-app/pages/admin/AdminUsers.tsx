import { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { subscribeToUsers, updateUserScore, type FSUser } from "@/react-app/lib/userService";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/react-app/lib/firebase";
import { isAdmin } from "@/react-app/lib/adminAuth";
import { toast } from "sonner";

type AppUser = FSUser;
type SortKey = "name" | "email" | "score" | "roundsCompleted" | "status" | "lastActive";
type SortDir = "asc" | "desc";

function emailToId(email: string) { return email.toLowerCase().replace(/[^a-z0-9]/g, "_"); }

const EMPTY_FORM = {
    name: "",
    email: "",
    score: 0,
    roundsCompleted: 0,
    lastActive: new Date().toISOString().split("T")[0],
    status: "active" as FSUser["status"],
};

export default function AdminUsers() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("score");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AppUser | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
    const adminAccess = isAdmin();

    // Real-time Firestore subscription
    useEffect(() => {
        const unsub = subscribeToUsers(setUsers);
        return unsub;
    }, []);

    const filtered = users
        .filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            const cmp =
                typeof av === "string" && typeof bv === "string"
                    ? av.localeCompare(bv)
                    : (av as number) - (bv as number);
            return sortDir === "asc" ? cmp : -cmp;
        });

    const handleSort = (key: SortKey) => {
        if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("desc"); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    };

    const openEdit = (user: AppUser) => {
        setEditing(user);
        setForm({
            name: user.name,
            email: user.email,
            role: user.role,
            score: user.score,
            roundsCompleted: user.roundsCompleted,
            lastActive: user.lastActive,
            status: user.status,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.email) { toast.error("Name and email are required."); return; }
        try {
            if (editing) {
                await updateUserScore(editing.email, form.score, form.roundsCompleted);
                toast.success("User updated successfully.");
            } else {
                toast.info("Ask participant to self-register via the login page.");
            }
            setModalOpen(false);
        } catch { toast.error("Update failed."); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteDoc(doc(db, "users", emailToId(deleteTarget.email)));
            toast.success(`${deleteTarget.name} removed.`);
            setDeleteTarget(null);
        } catch { toast.error("Delete failed."); }
    };

    const SortIcon = ({ col }: { col: SortKey }) =>
        sortKey === col
            ? sortDir === "asc"
                ? <ChevronUp className="w-3 h-3 inline ml-1" />
                : <ChevronDown className="w-3 h-3 inline ml-1" />
            : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-white text-2xl font-bold">User Management</h2>
                    <p className="text-white/40 text-sm mt-1">
                        {users.length} participants total
                    </p>
                </div>
                {adminAccess && (
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        <Plus className="w-4 h-4" />
                        Add User
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f0f1a] border border-white/5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
            </div>

            {/* Table */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {([
                                    ["name", "Name"],
                                    ["email", "Email"],
                                    ["score", "Score"],
                                    ["roundsCompleted", "Rounds"],
                                    ["status", "Status"],
                                    ["lastActive", "Last Active"],
                                ] as [SortKey, string][]).map(([key, label]) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className="text-left px-5 py-3 text-white/35 text-xs uppercase tracking-wider font-medium cursor-pointer hover:text-white/60 transition-colors select-none"
                                    >
                                        {label}
                                        <SortIcon col={key} />
                                    </th>
                                ))}
                                <th className="px-5 py-3 text-white/35 text-xs uppercase tracking-wider font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/3">
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-white/2 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/30 flex items-center justify-center text-xs font-bold text-violet-300 border border-violet-500/20 shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-white/90 font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-white/50">{user.email}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 max-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-violet-500 rounded-full"
                                                    style={{ width: `${user.score}%` }}
                                                />
                                            </div>
                                            <span className="text-white/80 font-semibold">{user.score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-white/50">{user.roundsCompleted}/3</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-white/40 text-xs">{user.lastActive}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            {adminAccess && (
                                                <>
                                                    <button
                                                        onClick={() => openEdit(user)}
                                                        aria-label="Edit user"
                                                        className="p-2 rounded-lg text-white/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(user)}
                                                        aria-label="Delete user"
                                                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-white/25 text-sm">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-[0_0_60px_rgba(139,92,246,0.2)]">
                        <h3 className="text-white font-bold text-lg mb-5">
                            {editing ? "Edit User" : "Add New User"}
                        </h3>
                        <div className="space-y-4">
                            {(["name", "email"] as const).map((f) => (
                                <div key={f}>
                                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5 capitalize">{f}</label>
                                    <input
                                        type={f === "email" ? "email" : "text"}
                                        value={form[f]}
                                        onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all placeholder-white/20"
                                    />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Role</label>
                                    <select
                                        value={form.role}
                                        onChange={e => setForm(p => ({ ...p, role: e.target.value as AppUser["role"] }))}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                                    >
                                        <option value="participant">Participant</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm(p => ({ ...p, status: e.target.value as AppUser["status"] }))}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Score (%)</label>
                                    <input
                                        type="number" min={0} max={100}
                                        value={form.score}
                                        onChange={e => setForm(p => ({ ...p, score: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Rounds Done</label>
                                    <input
                                        type="number" min={0} max={3}
                                        value={form.roundsCompleted}
                                        onChange={e => setForm(p => ({ ...p, roundsCompleted: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
                            >
                                {editing ? "Save Changes" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f0f1a] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_60px_rgba(239,68,68,0.1)]">
                        <h3 className="text-white font-bold text-lg mb-2">Delete User?</h3>
                        <p className="text-white/50 text-sm mb-6">
                            Are you sure you want to remove <span className="text-white font-medium">{deleteTarget.name}</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
