// Piston API — high-performance, free public code execution engine
// Docs: https://github.com/engineer-man/piston
const PISTON_BASE = "https://emkc.org/api/v2/piston";

// Language Config for Piston
export const PISTON_LANG_CONFIG: Record<string, { language: string; version: string }> = {
    python: { language: "python", version: "3.10.0" },
    javascript: { language: "javascript", version: "18.15.0" },
    java: { language: "java", version: "15.0.2" },
    c: { language: "c", version: "10.2.0" },
    cpp: { language: "cpp", version: "10.2.0" },
};

export interface ExecutionResult {
    output: string;   // final usable text (stdout + stderr)
    isError: boolean;
    statusId: number;
    statusLabel: string;
}

interface PistonResult {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
}

// ── Retry helper ─────────────────────────────────────────────────────
async function fetchWithRetry(
    url: string,
    opts: RequestInit,
    retries = 3,
    backoffMs = 1000
): Promise<Response> {
    for (let attempt = 0; attempt < retries; attempt++) {
        const res = await fetch(url, opts);
        // Piston usually returns 200 or 429/503.
        if (res.status !== 429 && res.status !== 503) return res;
        if (attempt < retries - 1) {
            const base = backoffMs * (attempt + 1);
            const jitter = base * 0.3 * (Math.random() * 2 - 1);
            await new Promise(r => setTimeout(r, Math.round(base + jitter)));
        }
    }
    throw new Error("Execution server is overloaded. Please wait and try again.");
}

// ── Session-storage cache (key = language+code+stdin hash) ───────────
function cacheKey(language: string, code: string, stdin: string) {
    let h = 5381;
    const s = `${language}||${code}||${stdin}`;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return `pist_${(h >>> 0).toString(36)}`;
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
 * Run source code via Piston. Results are cached in sessionStorage.
 */
export async function runCode(
    languageKey: string,
    sourceCode: string,
    stdin: string = ""
): Promise<ExecutionResult> {
    const key = cacheKey(languageKey, sourceCode, stdin);
    const cached = readCache(key);
    if (cached) return cached;

    const config = PISTON_LANG_CONFIG[languageKey];
    if (!config) throw new Error(`Unsupported language: ${languageKey}`);

    const response = await fetchWithRetry(
        `${PISTON_BASE}/execute`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: config.language,
                version: config.version,
                files: [{ content: sourceCode }],
                stdin,
            }),
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Execution error ${response.status}: ${text}`);
    }

    const raw = (await response.json()) as PistonResult;
    
    // Normalize result to match our ExecutionResult interface
    const isError = raw.run.code !== 0 || !!raw.run.stderr;
    const result: ExecutionResult = {
        output: raw.run.output.trim(),
        isError: isError,
        statusId: raw.run.code === 0 ? 3 : 11, // Map to Judge0-like status IDs for compatibility
        statusLabel: raw.run.code === 0 ? "Accepted" : "Runtime Error",
    };

    writeCache(key, result);
    return result;
}
