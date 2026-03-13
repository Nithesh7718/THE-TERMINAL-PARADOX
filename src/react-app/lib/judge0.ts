/**
 * Code Execution Engine
 * Primary: Judge0 Public CE (Confirmed network compatible)
 * Backup 1: OneCompiler.com (Direct API)
 * Backup 2: Wandbox
 */

const OC_API_KEY = "oc_44g72meh6_44g72meht_b0a22a1c4eb3543b95396844cf1b93d8c4ad596dd9d55a2a";

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

// ── OneCompiler.com Adapter (Primary Backup) ─────────────────────────

async function runOneCompiler(language: string, code: string, stdin: string): Promise<ExecutionResult | null> {
    try {
        // Map to OneCompiler language names
        const langMap: Record<string, string> = {
            python: "python",
            java: "java",
            javascript: "javascript",
            c: "c",
            cpp: "cpp"
        };
        const oneLang = langMap[language];
        if (!oneLang) return null;

        // OneCompiler requires specific filenames for some languages
        const fileExtMap: Record<string, string> = {
            python: "main.py",
            java: "Main.java",
            javascript: "main.js",
            c: "main.c",
            cpp: "main.cpp"
        };

        const response = await fetchWithTimeout("https://api.onecompiler.com/v1/run", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-API-Key": OC_API_KEY
            },
            body: JSON.stringify({
                language: oneLang,
                stdin: stdin,
                files: [
                    {
                        name: fileExtMap[language] || "main",
                        content: code
                    }
                ]
            }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        const isError = !!data.exception || (data.stderr && data.stderr.length > 0);
        
        return {
            output: (data.stdout || "") + (data.stderr || "") + (data.exception || ""),
            isError: !!isError,
            statusId: isError ? 11 : 3,
            statusLabel: isError ? "Runtime Error" : "Accepted",
        };
    } catch (e) {
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
 * Multi-Engine Execution Strategy (v5 - OneCompiler Fix)
 * 1. Judge0 (Network Safe)
 * 2. OneCompiler (High Limit Backup)
 * 3. Wandbox (Stable fallback)
 */
export async function runCode(
    languageKey: string,
    sourceCode: string,
    stdin: string = ""
): Promise<ExecutionResult> {
    const key = cacheKey("v5", languageKey, sourceCode, stdin);
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);

    // Attempt 1: Judge0
    let result = await runJudge0(languageKey, sourceCode, stdin);

    // Attempt 2: OneCompiler (High limit)
    if (!result) {
        console.warn("Judge0 failed. Attempting OneCompiler...");
        result = await runOneCompiler(languageKey, sourceCode, stdin);
    }

    // Attempt 3: Wandbox
    if (!result) {
        console.warn("Secondary failed. Attempting Wandbox...");
        result = await runWandbox(languageKey, sourceCode, stdin);
    }

    if (!result) {
        throw new Error("All code execution engines are currently offline. Please try again.");
    }

    sessionStorage.setItem(key, JSON.stringify(result));
    return result;
}
