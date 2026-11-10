import { AtSign, FolderGit2, Globe, Link2, Sparkles } from "lucide-react";
import { cleanUser, slugifyRepo, type Vars } from "@/utils/text";

interface PersonalizePanelProps {
  vars: Vars;
  onChange: (next: Vars) => void;
  compact?: boolean;
}

export function PersonalizePanel({ vars, onChange, compact }: PersonalizePanelProps) {
  const ready = Boolean(vars.user && vars.repo);
  const repoUrl = `https://github.com/${vars.user || "YOUR-USERNAME"}/${vars.repo || "YOUR-REPO"}`;
  const pagesUrl = `https://${(vars.user || "YOUR-USERNAME").toLowerCase()}.github.io/${vars.repo || "YOUR-REPO"}/`;

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Personalize the commands</h3>
          {!compact && <p className="text-xs text-slate-500">Every snippet below updates instantly.</p>}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">GitHub username</span>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
            <AtSign className="ml-2.5 h-4 w-4 text-slate-400" />
            <input
              value={vars.user}
              onChange={(e) => onChange({ ...vars, user: cleanUser(e.target.value) })}
              placeholder="octocat"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Repository name</span>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
            <FolderGit2 className="ml-2.5 h-4 w-4 text-slate-400" />
            <input
              value={vars.repo}
              onChange={(e) => onChange({ ...vars, repo: slugifyRepo(e.target.value) })}
              placeholder="my-react-app"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>
      </div>

      <div className="mt-4 space-y-2 border-t border-indigo-100 pt-4">
        <UrlRow icon={Link2} label="Repo link (submit this)" url={repoUrl} ready={ready} />
        <UrlRow icon={Globe} label="Live demo (after Pages setup)" url={pagesUrl} ready={ready} />
      </div>
    </div>
  );
}

function UrlRow({
  icon: Icon,
  label,
  url,
  ready,
}: {
  icon: typeof Link2;
  label: string;
  url: string;
  ready: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      {ready ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-mono text-xs text-indigo-700 underline-offset-2 hover:underline"
          title={url}
        >
          {url}
        </a>
      ) : (
        <span className="block truncate font-mono text-xs text-slate-400" title={url}>
          {url}
        </span>
      )}
    </div>
  );
}
