import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FolderTree,
  Globe,
  LifeBuoy,
  Monitor,
  PartyPopper,
  RotateCcw,
  Rocket,
  ShieldCheck,
  Terminal,
  UploadCloud,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { GitHubMark } from "@/components/GitHubMark";
import { PersonalizePanel } from "@/components/PersonalizePanel";
import { Section } from "@/components/Section";
import { StepCard } from "@/components/StepCard";
import { Troubleshooting } from "@/components/Troubleshooting";
import {
  checklist,
  deployWorkflow,
  fileRows,
  ghCliShortcut,
  stack,
  troubleshooting,
  uploadPaths,
  type PathId,
} from "@/data/guide";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/utils/cn";
import { Rich, type Vars } from "@/utils/text";

const NAV = [
  { id: "answer", label: "Short answer" },
  { id: "files", label: "What to upload" },
  { id: "push", label: "Push to GitHub" },
  { id: "deploy", label: "Live demo" },
  { id: "checklist", label: "Final checklist" },
  { id: "help", label: "Troubleshooting" },
];

const PATH_ICONS: Record<PathId, typeof Terminal> = {
  cli: Terminal,
  desktop: Monitor,
  browser: UploadCloud,
};

const ADDED_FILES = [
  { name: ".gitignore", why: "keeps node_modules & dist out" },
  { name: "README.md", why: "fill in the placeholders" },
  { name: ".github/workflows/deploy.yml", why: "auto-deploys to GitHub Pages" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export default function App() {
  const [vars, setVars] = useLocalStorage<Vars>("ship:vars", { user: "", repo: "" });
  const [pathId, setPathId] = useLocalStorage<PathId>("ship:path", "cli");
  const [done, setDone] = useLocalStorage<Record<string, boolean>>("ship:done", {});

  const path = uploadPaths.find((p) => p.id === pathId) ?? uploadPaths[0];
  const navIds = useMemo(() => NAV.map((n) => n.id), []);
  const active = useActiveSection(navIds);

  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const stepsDone = path.steps.filter((s) => done[s.id]).length;
  const checksDone = checklist.filter((c) => done[c.id]).length;
  const total = path.steps.length + checklist.length;
  const completed = stepsDone + checksDone;
  const pct = Math.round((completed / total) * 100);
  const allDone = completed === total;

  const resetProgress = () => {
    const next = { ...done };
    path.steps.forEach((s) => delete next[s.id]);
    checklist.forEach((c) => delete next[c.id]);
    setDone(next);
  };

  const repoUrl = `https://github.com/${vars.user || "YOUR-USERNAME"}/${vars.repo || "YOUR-REPO"}`;
  const pagesUrl = `https://${(vars.user || "YOUR-USERNAME").toLowerCase()}.github.io/${vars.repo || "YOUR-REPO"}/`;

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-slate-900 antialiased selection:bg-indigo-200/60">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#answer" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-300">
              <GitHubMark className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight">Ship it to GitHub</span>
              <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Submission guide for your Vite + React app
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  active === n.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden w-32 sm:block">
              <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <span>Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1",
                allDone
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-white text-slate-700 ring-slate-200",
              )}
            >
              {allDone ? <PartyPopper className="h-3.5 w-3.5" /> : <ClipboardCheck className="h-3.5 w-3.5" />}
              {completed}/{total}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <PersonalizePanel vars={vars} onChange={setVars} />

            <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {NAV.map((n, i) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    active === n.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold",
                      active === n.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <FileCheck2 className="h-4 w-4" />
                Added to your project
              </h3>
              <ul className="mt-3 space-y-2">
                {ADDED_FILES.map((f) => (
                  <li key={f.name} className="text-xs">
                    <code className="font-mono font-semibold text-emerald-900">{f.name}</code>
                    <span className="block text-emerald-700/80">{f.why}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-20">
          {/* ───────────── Short answer ───────────── */}
          <section id="answer" className="scroll-mt-24">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200/60 to-violet-200/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-200/50 to-teal-100/30 blur-3xl" />

              <div className="relative p-6 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Short answer
                </div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Yes — upload it to GitHub.
                  <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Here's exactly how.
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-slate-600">
                  This is a standard <strong className="font-semibold text-slate-900">Vite + React + TypeScript + Tailwind</strong>{" "}
                  project, which is precisely what GitHub is built for. You push the{" "}
                  <strong className="font-semibold text-slate-900">source code</strong> (not <code className="rounded bg-slate-100 px-1 font-mono text-[0.9em]">node_modules</code>, not the build output),
                  then submit the repository link. Pick one of the three methods below — the terminal one takes about five minutes.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {stack.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm"
                    >
                      {s.name}
                      <span className="font-mono text-slate-400">{s.version}</span>
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#push"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-700"
                  >
                    Start pushing
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#files"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    What goes in the repo?
                  </a>
                </div>
              </div>

              <div className="relative grid gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-3">
                <Fact
                  icon={ShieldCheck}
                  title="Already prepared for you"
                  body={
                    <>
                      I added <code className="font-mono">.gitignore</code>, a <code className="font-mono">README.md</code> template and a
                      GitHub Pages deploy workflow, so the repo looks professional from the first commit.
                    </>
                  }
                />
                <Fact
                  icon={Zap}
                  title="Single-file build"
                  body={
                    <>
                      <code className="font-mono">npm run build</code> produces one self-contained{" "}
                      <code className="font-mono">dist/index.html</code>. Handy if your course also wants a built file — just attach it.
                    </>
                  }
                />
                <Fact
                  icon={Globe}
                  title="Two links to submit"
                  body={
                    <>
                      The repo URL is mandatory; a live GitHub Pages URL is a bonus that lets graders try the app without installing anything.
                    </>
                  }
                />
              </div>
            </div>

            {/* Mobile personalize panel */}
            <div className="mt-6 lg:hidden">
              <PersonalizePanel vars={vars} onChange={setVars} compact />
            </div>
          </section>

          {/* ───────────── Files ───────────── */}
          <Section
            id="files"
            icon={FolderTree}
            eyebrow="Step 0"
            title="What to upload — and what to leave out"
            description="Graders need to be able to clone your repo and run it. Everything they need is small; everything they don't is enormous."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FileList
                title="Upload these"
                tone="good"
                icon={CheckCircle2}
                rows={fileRows.filter((r) => r.include)}
              />
              <FileList
                title="Never upload these"
                tone="bad"
                icon={XCircle}
                rows={fileRows.filter((r) => !r.include)}
              />
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">What the grader will see</h3>
              <p className="mt-1 text-sm text-slate-600">
                A clean repository root looks like this — short, obvious, and runnable with <code className="rounded bg-slate-100 px-1 font-mono text-[0.9em]">npm install &amp;&amp; npm run dev</code>.
              </p>
              <CodeBlock
                className="mt-4"
                label={`${vars.repo || "YOUR-REPO"}/`}
                vars={vars}
                code={`.github/workflows/deploy.yml
src/
  components/
  data/
  hooks/
  utils/
  App.tsx
  index.css
  main.tsx
.gitignore
README.md
index.html
package.json
package-lock.json
tsconfig.json
vite.config.ts`}
              />
            </div>
          </Section>

          {/* ───────────── Push ───────────── */}
          <Section
            id="push"
            icon={Rocket}
            eyebrow="The main event"
            title="Push your project to GitHub"
            description="Choose the method that fits you. Your progress is saved in this browser, so you can switch tabs and come back."
            aside={
              <button
                type="button"
                onClick={resetProgress}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset progress
              </button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Upload method">
              {uploadPaths.map((p) => {
                const Icon = PATH_ICONS[p.id];
                const selected = p.id === path.id;
                const pDone = p.steps.filter((s) => done[s.id]).length;
                return (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={selected}
                    type="button"
                    onClick={() => setPathId(p.id)}
                    className={cn(
                      "group relative rounded-2xl border p-4 text-left transition-all duration-200",
                      selected
                        ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl transition",
                          selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        {pDone}/{p.steps.length}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-bold text-slate-900">{p.label}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{p.tagline}</div>
                    {p.id === "cli" && (
                      <span className="absolute -top-2 right-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Recommended
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
              <p>{path.bestFor}</p>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  {stepsDone} of {path.steps.length} steps done
                </span>
                <span className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(stepsDone / path.steps.length) * 100}%` }}
                  />
                </span>
              </div>
              <ol>
                {path.steps.map((step, i) => (
                  <StepCard
                    key={step.id}
                    index={i + 1}
                    step={step}
                    done={Boolean(done[step.id])}
                    onToggle={() => toggle(step.id)}
                    vars={vars}
                    isLast={i === path.steps.length - 1}
                  />
                ))}
              </ol>
            </div>

            {path.id === "cli" && (
              <div className="mt-8 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                  <Zap className="h-4 w-4" />
                  Power-user shortcut (GitHub CLI)
                </h3>
                <p className="mt-1 text-sm text-indigo-900/80">
                  If you have <code className="rounded bg-white px-1 font-mono text-[0.9em]">gh</code> installed and logged in, this one command replaces steps 4 and 5 — it creates the repo, adds the remote and pushes.
                </p>
                <CodeBlock className="mt-3" code={ghCliShortcut} vars={vars} />
              </div>
            )}
          </Section>

          {/* ───────────── Deploy ───────────── */}
          <Section
            id="deploy"
            icon={Globe}
            eyebrow="Optional, but impressive"
            title="Get a live demo link with GitHub Pages"
            description="The workflow file is already in your project. Once the repo is on GitHub, three clicks turn it into a public URL."
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-3">
                {[
                  {
                    t: "Push the project",
                    b: "Finish the section above. The .github/workflows/deploy.yml file travels with your code.",
                  },
                  {
                    t: "Settings → Pages → Source: GitHub Actions",
                    b: "In your repo, open Settings, click Pages in the sidebar, and under “Build and deployment” change Source to GitHub Actions. No branch selection needed.",
                  },
                  {
                    t: "Watch the Actions tab go green",
                    b: "Open the Actions tab. The “Deploy to GitHub Pages” run takes about a minute. If it didn't start, push any small commit or click “Run workflow”.",
                  },
                  {
                    t: "Open your live URL",
                    b: "It's shown on the Pages settings screen and in the workflow summary. Add it to your README and your submission.",
                  },
                ].map((s, i) => (
                  <div key={s.t} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{s.t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.b}</p>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <span className="font-bold">Why no extra config?</span> Vite normally needs a{" "}
                  <code className="rounded bg-white px-1 font-mono text-[0.9em]">base</code> setting for Pages sub-paths, but this project uses{" "}
                  <code className="rounded bg-white px-1 font-mono text-[0.9em]">vite-plugin-singlefile</code>, which inlines all JS and CSS into one HTML file.
                  There are no asset paths to break.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your live URL will be</div>
                  <code className="mt-1 block break-all font-mono text-sm text-indigo-700">{pagesUrl}</code>
                </div>
              </div>

              <div>
                <CodeBlock code={deployWorkflow} label="yaml · .github/workflows/deploy.yml" vars={vars} />
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Already saved in your project — you only need to copy this if the <code className="font-mono">.github</code> folder got lost
                  (it's hidden on most systems). Uses the current action versions: checkout v7, setup-node v7, configure-pages v6,
                  upload-pages-artifact v5, deploy-pages v5.
                </p>
              </div>
            </div>
          </Section>

          {/* ───────────── Checklist ───────────── */}
          <Section
            id="checklist"
            icon={ClipboardCheck}
            eyebrow="Before you hit submit"
            title="Final pre-submission checklist"
            description="Two minutes here prevents the most common lost marks."
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                <span className="text-sm font-semibold text-slate-700">
                  {checksDone}/{checklist.length} checked
                </span>
                <span className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(checksDone / checklist.length) * 100}%` }}
                  />
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {checklist.map((item) => {
                  const checked = Boolean(done[item.id]);
                  return (
                    <li key={item.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer gap-4 px-5 py-4 transition hover:bg-slate-50",
                          checked && "bg-emerald-50/40",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(item.id)}
                          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-slate-300 accent-emerald-500"
                        />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block text-[15px] font-semibold text-slate-900",
                              checked && "text-slate-500 line-through decoration-slate-300",
                            )}
                          >
                            <Rich text={item.label} vars={vars} />
                          </span>
                          <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">
                            <Rich text={item.detail} vars={vars} />
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div
              className={cn(
                "mt-5 overflow-hidden rounded-2xl border p-6 transition-all duration-500",
                allDone
                  ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-100"
                  : "border-slate-200 bg-white",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      allDone ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-400",
                    )}
                  >
                    <PartyPopper className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {allDone ? "You're ready to submit!" : `${total - completed} item${total - completed === 1 ? "" : "s"} to go`}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {allDone
                        ? "Paste this link into your submission form:"
                        : "Finish the steps and checklist above, then grab your link here."}
                    </p>
                  </div>
                </div>
                <CodeBlock code="https://github.com/{{user}}/{{repo}}" label="submission link" vars={vars} className="w-full sm:w-auto sm:min-w-[320px]" />
              </div>
              {allDone && vars.user && vars.repo && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
                >
                  Open repository to double-check
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </Section>

          {/* ───────────── Troubleshooting ───────────── */}
          <Section
            id="help"
            icon={LifeBuoy}
            eyebrow="When something goes wrong"
            title="Troubleshooting"
            description="The seven errors that account for nearly every stuck submission — with the exact fix."
          >
            <Troubleshooting items={troubleshooting} vars={vars} />
          </Section>

          <footer className="border-t border-slate-200 pt-8 text-sm text-slate-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p>
                Progress and your username/repo are stored only in this browser (localStorage) — nothing is sent anywhere.
              </p>
              <div className="flex flex-wrap gap-2">
                {ADDED_FILES.map((f) => (
                  <code key={f.name} className="rounded-md bg-white px-2 py-1 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                    + {f.name}
                  </code>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────── Small presentational helpers ─────────────────────── */

function Fact({ icon: Icon, title, body }: { icon: typeof Zap; title: string; body: ReactNode }) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:text-[0.9em]">
        {body}
      </p>
    </div>
  );
}

function FileList({
  title,
  tone,
  icon: Icon,
  rows,
}: {
  title: string;
  tone: "good" | "bad";
  icon: typeof CheckCircle2;
  rows: { path: string; why: string }[];
}) {
  const good = tone === "good";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-sm",
        good ? "border-emerald-200" : "border-rose-200",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-5 py-3 text-sm font-bold",
          good ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800",
        )}
      >
        <Icon className="h-4.5 w-4.5" />
        {title}
      </div>
      <ul className="divide-y divide-slate-100">
        {rows.map((r) => (
          <li key={r.path} className="px-5 py-3">
            <code className={cn("font-mono text-[13px] font-semibold", good ? "text-slate-900" : "text-rose-700")}>
              {r.path}
            </code>
            <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600 [&_code]:font-mono">{r.why}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
