import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Trouble } from "@/data/guide";
import { cn } from "@/utils/cn";
import { Rich, type Vars } from "@/utils/text";
import { CodeBlock } from "./CodeBlock";

export function Troubleshooting({ items, vars }: { items: Trouble[]; vars: Vars }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-50 font-mono text-xs font-bold text-rose-600 ring-1 ring-rose-100">
                  !
                </span>
                <span className="text-[15px] font-semibold text-slate-900">{item.problem}</span>
              </span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-sm leading-relaxed">
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Why it happens: </span>
                    <Rich text={item.cause} vars={vars} />
                  </p>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Fix: </span>
                    <Rich text={item.fix} vars={vars} />
                  </p>
                  {item.code && <CodeBlock code={item.code} vars={vars} />}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
