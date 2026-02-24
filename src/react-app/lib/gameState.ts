// Centralised game-state helpers (localStorage-based; replace with backend later)

const GAME_KEY = "gameStarted";

export function isGameStarted(): boolean {
    try { return localStorage.getItem(GAME_KEY) === "true"; } catch { return false; }
}

export function startGame(): void {
    try { localStorage.setItem(GAME_KEY, "true"); } catch { /* ignore */ }
}

export function stopGame(): void {
    try { localStorage.setItem(GAME_KEY, "false"); } catch { /* ignore */ }
}
