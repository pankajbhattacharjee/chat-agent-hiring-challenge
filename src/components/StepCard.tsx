import { AlertTriangle, Check, CheckCircle2, ExternalLink, Info } from "lucide-react";
import type { Step } from "@/data/guide";
import { cn } from "@/utils/cn";
import { Rich, type Vars } from "@/utils/text";
import { CodeBlock } from "./CodeBlock";

interface StepCardProps {
  index: number;
  step: Step;
  done: boolean;
  onToggle: () => void;
  vars: Vars;
  isLast?: boolean;
}

const toneStyles = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const toneIcon = {
  info: Info,
  warn: AlertTriangle,
  success: CheckCircle2,
};

export function StepCard({ index, step, done, onToggle, vars, isLast }: StepCardProps) {
  const tone = step.noteTone ?? "info";
  const NoteIcon = toneIcon[tone];

  return (
    <li className="relative flex gap-4 sm:gap-5">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? `Mark step ${index} as not done` : `Mark step ${index} as done`}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-all duration-200",
            done
              ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200"
              : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600",
          )}
        >
          {done ? <Check className="h-4.5 w-4.5" strokeWidth={3} /> : index}
        </button>
        {!isLast && (
          <div
            className={cn(
              "mt-2 w-0.5 flex-1 rounded-full transition-colors",
              done ? "bg-emerald-300" : "bg-slate-200",
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className={cn("min-w-0 flex-1 pb-8", isLast && "pb-0")}>
        <div
          className={cn(
            "rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200",
            done ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 hover:border-slate-300",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "text-[15px] font-semibold leading-snug text-slate-900 sm:text-base",
                done && "text-slate-500 line-through decoration-slate-300",
              )}
            >
              <Rich text={step.title} vars={vars} />
            </h3>
            <label className="flex shrink-0 cursor-pointer select-none items-center gap-2 text-xs font-medium text-slate-500">
              <input
                type="checkbox"
                checked={done}
                onChange={onToggle}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-500"
              />
              Done
            </label>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <Rich text={step.body} vars={vars} />
          </p>

          {step.link && (
            <a
              href={step.link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              {step.link.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {step.code && <CodeBlock code={step.code} label={step.codeLabel} vars={vars} className="mt-4" />}

          {step.note && (
            <div className={cn("mt-4 flex gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed", toneStyles[tone])}>
              <NoteIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <Rich text={step.note} vars={vars} />
              </p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
