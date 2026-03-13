/**
 * Code Execution Engine
 * Primary: OnlineCompiler.io (1 Million Free Runs/Month) - Reliable for 60+ users
 * Fallback 1: Judge0 Public CE
 * Fallback 2: Wandbox
 */

const OC_API_KEY = "oc_44g72meh6_44g72meht_b0a22a1c4eb3543b95396844cf1b93d8c4ad596dd9d55a2a";

const OC_LANG_CONFIG: Record<string, string> = {
    python: "Py",
    javascript: "Ty", // Deno/Node/TypeScript
    java: "Ja",
    c: "C",
    cpp: "C+",
};

const JUDGE0_LANG_CONFIG: Record<string, number> = {
    python: 100,
    javascript: 102,
    java: 91,
    c: 103,
    cpp: 105,
};

const WANDBOX_LANG_CONFIG: Record<string, string> = {
    python: "cpython-head",
    javascript: "nodejs-head",
    java: "java-head",
    c: "gcc-head-c",
    cpp: "gcc-head",
};

export interface ExecutionResult {
    output: string;
    isError: boolean;
    statusId: number;
    statusLabel: string;
}

// ── Shared Helpers ──────────────────────────────────────────────────

async function fetchWithTimeout(url: string, opts: RequestInit, timeout = 12000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { ...opts, signal: controller.signal });
        clearTimeout(id);
        return res;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

function cacheKey(service: string, language: string, code: string, stdin: string) {
    let h = 5381;
    const s = `${service}||${language}||${code}||${stdin}`;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return `run_${(h >>> 0).toString(36)}`;
}

// ── OnlineCompiler.io Adapter (Primary) ─────────────────────────────

async function runOnlineCompiler(language: string, code: string, stdin: string): Promise<ExecutionResult | null> {
    try {
        const compiler = OC_LANG_CONFIG[language];
        if (!compiler) return null;

        const response = await fetchWithTimeout("https://api.onlinecompiler.io/api/run-code/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": OC_API_KEY
            },
            body: JSON.stringify({
                compiler,
                code,
                input: stdin,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.warn("OnlineCompiler error", response.status, err);
            return null;
        }

        const data = await response.json();
        // OnlineCompiler usually returns { output: "...", error: "..." }
        const isError = !!data.error;
        return {
            output: (data.output || "") + (data.error || ""),
            isError: isError,
            statusId: isError ? 11 : 3,
            statusLabel: isError ? "Runtime Error" : "Accepted",
        };
    } catch (e) {
        console.error("OnlineCompiler failed", e);
        return null;
    }
}

// ── Judge0 Adapter (Secondary) ───────────────────────────────────────

async function runJudge0(language: string, code: string, stdin: string): Promise<ExecutionResult | null> {
    try {
        const langId = JUDGE0_LANG_CONFIG[language];
        if (!langId) return null;

        const response = await fetchWithTimeout("https://ce.judge0.com/submissions?wait=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source_code: code,
                language_id: langId,
                stdin,
            }),
        });

        if (!response.ok) return null;
        const data = await response.json();
        return {
            output: (data.stdout || "") + (data.stderr || "") + (data.compile_output || ""),
            isError: data.status.id !== 3,
            statusId: data.status.id,
            statusLabel: data.status.description,
        };
    } catch (e) { return null; }
}

// ── Wandbox Adapter (Tertiary) ───────────────────────────────────────

async function runWandbox(language: string, code: string, stdin: string): Promise<ExecutionResult | null> {
    try {
        const compiler = WANDBOX_LANG_CONFIG[language];
        if (!compiler) return null;

        const response = await fetchWithTimeout("https://wandbox.org/api/compile.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                compiler,
                code,
                stdin,
            }),
        });

        if (!response.ok) return null;
        const data = await response.json();
        const isError = data.status !== "0";
        return {
            output: (data.program_output || "") + (data.program_error || "") + (data.compiler_error || ""),
            isError: isError,
            statusId: isError ? 11 : 3,
            statusLabel: isError ? "Runtime Error" : "Accepted",
        };
    } catch (e) { return null; }
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Multi-Engine Execution Strategy (v3)
 * 1. OnlineCompiler (Highest limit, best for 60 users)
 * 2. Judge0 (Fast backup)
 * 3. Wandbox (Final stable backup)
 */
export async function runCode(
    languageKey: string,
    sourceCode: string,
    stdin: string = ""
): Promise<ExecutionResult> {
    const key = cacheKey("v3", languageKey, sourceCode, stdin);
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);

    // Try Primary
    let result = await runOnlineCompiler(languageKey, sourceCode, stdin);

    // Try Secondary
    if (!result) {
        console.warn("Primary failed. Attempting Judge0...");
        result = await runJudge0(languageKey, sourceCode, stdin);
    }

    // Try Tertiary
    if (!result) {
        console.warn("Secondary failed. Attempting Wandbox...");
        result = await runWandbox(languageKey, sourceCode, stdin);
    }

    if (!result) {
        throw new Error("All code execution engines are currently offline. Please wait 10 seconds and try again.");
    }

    sessionStorage.setItem(key, JSON.stringify(result));
    return result;
}
