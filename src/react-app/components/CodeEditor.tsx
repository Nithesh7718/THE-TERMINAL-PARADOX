import Editor from "@monaco-editor/react";
import { cn } from "@/react-app/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

const languageMap: Record<string, string> = {
  python: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  javascript: "javascript",
};

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  height = "400px",
  className,
}: CodeEditorProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-border",
        className
      )}
    >
      <Editor
        height={height}
        language={languageMap[language] || "plaintext"}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
