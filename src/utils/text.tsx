import { Fragment, type ReactNode } from "react";

export interface Vars {
  user: string;
  repo: string;
}

export const PLACEHOLDERS: Vars = { user: "YOUR-USERNAME", repo: "YOUR-REPO" };

/** Replace {{user}} / {{repo}} tokens with the provided values (or readable placeholders). */
export function fill(text: string, vars: Vars): string {
  return text
    .replace(/\{\{user\}\}/g, vars.user || PLACEHOLDERS.user)
    .replace(/\{\{repo\}\}/g, vars.repo || PLACEHOLDERS.repo);
}

/** Turn free text into a safe GitHub repo name: lowercase, hyphens, no weird characters. */
export function slugifyRepo(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 100);
}

/** Strip characters GitHub usernames can't contain. */
export function cleanUser(input: string): string {
  return input.trim().replace(/^@/, "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 39);
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

/**
 * Minimal inline renderer: **bold** and `code`, with tokens personalized.
 * Deliberately tiny — no markdown library needed for a guide this size.
 */
export function Rich({ text, vars }: { text: string; vars: Vars }): ReactNode {
  const filled = fill(text, vars);
  const parts = filled.split(INLINE);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 ring-1 ring-slate-200"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
