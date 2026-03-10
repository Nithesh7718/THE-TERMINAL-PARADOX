// Judge0 CE — free public code execution API
// Docs: https://ce.judge0.com/

const JUDGE0_BASE = "https://ce.judge0.com";

// Language IDs for Judge0 CE
export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
    python: 71,      // Python 3.8.1
    javascript: 63,  // Node.js 12.14.0
    java: 62,        // OpenJDK 13.0.1
    c: 50,           // C GCC 9.2.0
    cpp: 54,         // C++ GCC 9.2.0
};

// Judge0 status IDs
const STATUS: Record<number, string> = {
    1: "In Queue",
    2: "Processing",
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error",
};

export interface Judge0Result {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    status: { id: number; description: string };
    time: string | null;
    memory: number | null;
}

export interface ExecutionResult {
    output: string;   // final usable text (trimmed stdout or error description)
    isError: boolean;
    statusId: number;
    statusLabel: string;
}

// ── Retry helper ─────────────────────────────────────────────────────
async function fetchWithRetry(
    url: string,
    opts: RequestInit,
    retries = 3,
    backoffMs = 800
): Promise<Response> {
    for (let attempt = 0; attempt < retries; attempt++) {
        const res = await fetch(url, opts);
        if (res.status !== 429 && res.status !== 503) return res;
        if (attempt < retries - 1) {
            await new Promise(r => setTimeout(r, backoffMs * (attempt + 1)));
        }
    }
    throw new Error("Judge0 is overloaded. Please wait a moment and try again.");
}

// ── Session-storage cache (key = language+code+stdin hash) ───────────
function cacheKey(language: string, code: string, stdin: string) {
    // Simple djb2-style hash — good enough for sessionStorage keys
    let h = 5381;
    const s = `${language}||${code}||${stdin}`;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return `j0_${(h >>> 0).toString(36)}`;
}

function readCache(key: string): ExecutionResult | null {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as ExecutionResult) : null;
    } catch { return null; }
}

function writeCache(key: string, val: ExecutionResult) {
    try { sessionStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Run source code via Judge0. Results are cached in sessionStorage so
 * identical (language, code, stdin) tuples don't hit the network twice.
 */
export async function runCode(
    languageKey: string,
    sourceCode: string,
    stdin: string = ""
): Promise<ExecutionResult> {
    const key = cacheKey(languageKey, sourceCode, stdin);
    const cached = readCache(key);
    if (cached) return cached;

    const languageId = JUDGE0_LANGUAGE_IDS[languageKey];
    if (!languageId) throw new Error(`Unsupported language: ${languageKey}`);

    const response = await fetchWithRetry(
        `${JUDGE0_BASE}/submissions?wait=true&base64_encoded=false`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ source_code: sourceCode, language_id: languageId, stdin }),
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Judge0 API error ${response.status}: ${text}`);
    }

    const raw = (await response.json()) as Judge0Result;
    const result = extractOutput(raw);

    writeCache(key, result);
    return result;
}

/**
 * Map a raw Judge0 result to a clean ExecutionResult.
 * All known status IDs are handled explicitly.
 */
export function extractOutput(result: Judge0Result): ExecutionResult {
    const id = result.status.id;
    const label = STATUS[id] ?? result.status.description;

    if (id === 3) {
        // Accepted — real stdout
        return {
            output: (result.stdout ?? "").trim(),
            isError: false,
            statusId: id,
            statusLabel: label,
        };
    }

    if (id === 5) {
        return {
            output: "⏱ Time Limit Exceeded — check for infinite loops",
            isError: true,
            statusId: id,
            statusLabel: label,
        };
    }

    if (id === 6) {
        const msg = (result.compile_output ?? "").trim();
        return {
            output: msg ? `Compile Error:\n${msg}` : "Compilation failed.",
            isError: true,
            statusId: id,
            statusLabel: label,
        };
    }

    // Any runtime error (7–12)
    if (id >= 7 && id <= 12) {
        const msg = (result.stderr ?? "").trim();
        return {
            output: msg ? `${label}:\n${msg}` : label,
            isError: true,
            statusId: id,
            statusLabel: label,
        };
    }

    // Fallback — include stderr / stdout if present
    const fallback = (result.stderr ?? result.stdout ?? label).trim();
    return { output: fallback || label, isError: true, statusId: id, statusLabel: label };
}
