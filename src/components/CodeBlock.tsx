import { Check, Copy } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { fill, PLACEHOLDERS, type Vars } from "@/utils/text";

interface CodeBlockProps {
  code: string;
  label?: string;
  vars: Vars;
  className?: string;
}

const TOKEN = /(\{\{user\}\}|\{\{repo\}\})/g;

export function CodeBlock({ code, label, vars, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const filled = fill(code, vars);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(filled);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = filled;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
  };

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] text-[13px] leading-relaxed shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
          {label ?? "bash"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy to clipboard"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition",
            copied
              ? "bg-emerald-500/15 text-emerald-300"
              : "text-slate-300 hover:bg-white/10 hover:text-white",
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-slate-100">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            {lines.length > 1 && (
              <span className="mr-4 w-4 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
            )}
            <code className="whitespace-pre">
              {line.split(TOKEN).map((part, j) => {
                if (part === "{{user}}" || part === "{{repo}}") {
                  const key = part === "{{user}}" ? "user" : "repo";
                  const value = vars[key];
                  const isPlaceholder = !value;
                  return (
                    <span
                      key={j}
                      title={isPlaceholder ? "Fill this in using the Personalize panel" : undefined}
                      className={cn(
                        "rounded px-1 -mx-0.5",
                        isPlaceholder
                          ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40"
                          : "bg-emerald-400/10 text-emerald-300",
                      )}
                    >
                      {value || PLACEHOLDERS[key]}
                    </span>
                  );
                }
                return <Fragment key={j}>{part}</Fragment>;
              })}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}
