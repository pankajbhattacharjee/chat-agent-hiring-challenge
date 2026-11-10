export type PathId = "cli" | "desktop" | "browser";

export interface Step {
  id: string;
  title: string;
  /** Short explanation shown under the title. Supports **bold** via markdown-ish markers. */
  body: string;
  /** Optional code to show with a copy button. `{{user}}` / `{{repo}}` are personalized. */
  code?: string;
  codeLabel?: string;
  /** Optional callout under the code block. */
  note?: string;
  noteTone?: "info" | "warn" | "success";
  /** Optional external link. */
  link?: { label: string; href: string };
}

export interface UploadPath {
  id: PathId;
  label: string;
  tagline: string;
  bestFor: string;
  steps: Step[];
}

export const uploadPaths: UploadPath[] = [
  {
    id: "cli",
    label: "Terminal (git)",
    tagline: "The standard way. Six commands and you're done.",
    bestFor: "Best if you have Git installed — it also gives you proper commit history, which graders like to see.",
    steps: [
      {
        id: "cli-1",
        title: "Open a terminal inside the project folder",
        body: "Export/download the project from this builder if you haven't already, unzip it, then `cd` into it. You should see `package.json`, `src/` and `index.html`.",
        code: "cd path/to/your-project\nls",
        codeLabel: "bash",
        note: "If `ls` shows a `node_modules` folder, that's fine — the `.gitignore` I added keeps it out of GitHub automatically.",
        noteTone: "info",
      },
      {
        id: "cli-2",
        title: "Make sure Git knows who you are (first time only)",
        body: "Git stamps every commit with a name and email. Use the email tied to your GitHub account so the commits count on your profile.",
        code: 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"',
        codeLabel: "bash",
      },
      {
        id: "cli-3",
        title: "Initialize the repository and make your first commit",
        body: "This turns the folder into a Git repo, stages every file that isn't ignored, and records a snapshot.",
        code: 'git init\ngit add .\ngit commit -m "Initial commit: Vite + React + Tailwind app"\ngit branch -M main',
        codeLabel: "bash",
        note: "Sanity check: run `git status` — it should say \"nothing to commit, working tree clean\". If you see thousands of files from `node_modules`, see the Troubleshooting section.",
        noteTone: "warn",
      },
      {
        id: "cli-4",
        title: "Create an empty repository on GitHub",
        body: "Go to **github.com/new**. Name it `{{repo}}`, choose **Public** (unless your course says otherwise), and leave **all three checkboxes unticked** — no README, no .gitignore, no license. Your project already has them, and an empty remote avoids a merge conflict on the first push.",
        link: { label: "Open github.com/new", href: "https://github.com/new" },
      },
      {
        id: "cli-5",
        title: "Connect your folder to GitHub and push",
        body: "Copy the two commands below (they already include your username and repo name).",
        code: "git remote add origin https://github.com/{{user}}/{{repo}}.git\ngit push -u origin main",
        codeLabel: "bash",
        note: "If Git asks for a password, your GitHub account password will NOT work. Paste a Personal Access Token instead (GitHub → Settings → Developer settings → Personal access tokens → Generate new token, with the `repo` scope). Or run `gh auth login` if you have the GitHub CLI.",
        noteTone: "warn",
      },
      {
        id: "cli-6",
        title: "Verify it worked",
        body: "Open your repository in the browser. You should see `src/`, `index.html`, `package.json`, `README.md` and the `.github` folder — and **no** `node_modules`. That link is what you submit.",
        code: "https://github.com/{{user}}/{{repo}}",
        codeLabel: "your submission link",
      },
    ],
  },
  {
    id: "desktop",
    label: "GitHub Desktop",
    tagline: "Point-and-click, no terminal required.",
    bestFor: "Best if you're not comfortable with the command line but still want real commits and easy future updates.",
    steps: [
      {
        id: "desk-1",
        title: "Install GitHub Desktop and sign in",
        body: "Download it, open it, and sign in with your GitHub account (File → Options/Preferences → Accounts).",
        link: { label: "Download GitHub Desktop", href: "https://desktop.github.com/" },
      },
      {
        id: "desk-2",
        title: "Add your project folder",
        body: "Click **File → Add Local Repository** and pick your project folder. GitHub Desktop will say *\"This directory does not appear to be a Git repository\"* — click the **create a repository** link in that message, keep the defaults, and click **Create Repository**.",
        note: "Leave \"Initialize this repository with a README\" and \"Git ignore\" unticked — the project already contains both.",
        noteTone: "info",
      },
      {
        id: "desk-3",
        title: "Check the file list before committing",
        body: "The left panel lists every file about to be committed. You should see a few dozen files at most. If you see **thousands** of files under `node_modules/`, the `.gitignore` is missing — make sure it's in the folder (it's a hidden file) and restart GitHub Desktop.",
        noteTone: "warn",
      },
      {
        id: "desk-4",
        title: "Make the first commit",
        body: "In the bottom-left box type a summary like `Initial commit`, then click **Commit to main**.",
      },
      {
        id: "desk-5",
        title: "Publish to GitHub",
        body: "Click the big **Publish repository** button at the top. Name it `{{repo}}`, **untick \"Keep this code private\"** if your submission must be public, make sure the owner is `{{user}}`, then click **Publish Repository**.",
      },
      {
        id: "desk-6",
        title: "Verify and copy your link",
        body: "Click **Repository → View on GitHub**. Confirm you see your source files and no `node_modules`. This is the link you submit:",
        code: "https://github.com/{{user}}/{{repo}}",
        codeLabel: "your submission link",
      },
    ],
  },
  {
    id: "browser",
    label: "Browser upload",
    tagline: "Nothing to install — drag and drop on github.com.",
    bestFor: "Fine for a one-time submission. Limits: 100 files per upload and 25 MiB per file, so you MUST leave out node_modules.",
    steps: [
      {
        id: "web-1",
        title: "Create a new repository",
        body: "Go to **github.com/new**, name it `{{repo}}`, set it to **Public**, and this time **tick \"Add a README file\"** so the repo isn't empty (you'll replace the README in the next step). Click **Create repository**.",
        link: { label: "Open github.com/new", href: "https://github.com/new" },
      },
      {
        id: "web-2",
        title: "Prepare the folder on your computer",
        body: "Open the project folder in Finder / File Explorer. **Do not upload `node_modules` or `dist`.** Everything else goes in: `src/`, `.github/`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `README.md`.",
        note: "Hidden files (`.gitignore`, the `.github` folder) are invisible by default. macOS: press ⌘ + Shift + . in Finder. Windows: View → Show → Hidden items.",
        noteTone: "info",
      },
      {
        id: "web-3",
        title: "Drag everything into GitHub",
        body: "In your new repo click **Add file → Upload files**. Drag the `src` folder, the `.github` folder, and the loose files onto the upload area. Dragging folders (not just files) preserves the directory structure. Wait for every file to show a green checkmark.",
        note: "Folder drag-and-drop works in Chrome and Edge. Safari/Firefox may only accept individual files — if so, switch browser for this step.",
        noteTone: "warn",
      },
      {
        id: "web-4",
        title: "Commit the upload",
        body: "Scroll down, type a commit message like `Add project source`, keep **\"Commit directly to the main branch\"** selected, and click **Commit changes**. Uploading a `README.md` with the same name replaces the placeholder one.",
      },
      {
        id: "web-5",
        title: "Verify the structure",
        body: "Back on the repo home page, open the `src` folder and confirm `App.tsx` and `main.tsx` are inside it (not loose at the top level). If the structure is wrong, delete the files and re-upload by dragging the folder itself.",
        code: "https://github.com/{{user}}/{{repo}}",
        codeLabel: "your submission link",
      },
    ],
  },
];

export interface FileRow {
  path: string;
  include: boolean;
  why: string;
}

export const fileRows: FileRow[] = [
  { path: "src/", include: true, why: "Your actual application code — the whole point of the submission." },
  { path: "index.html", include: true, why: "Vite's entry point; the app can't build without it." },
  { path: "package.json", include: true, why: "Lists dependencies and scripts so anyone can run `npm install`." },
  { path: "package-lock.json", include: true, why: "Pins exact versions — guarantees graders get the same build you did." },
  { path: "vite.config.ts  ·  tsconfig.json", include: true, why: "Build and TypeScript configuration." },
  { path: ".gitignore", include: true, why: "Tells Git what to skip. Added for you." },
  { path: "README.md", include: true, why: "First thing a grader reads. Added for you — fill in the placeholders." },
  { path: ".github/workflows/deploy.yml", include: true, why: "Auto-deploys a live demo to GitHub Pages. Added for you." },
  { path: "node_modules/", include: false, why: "Tens of thousands of files, hundreds of MB. Anyone can recreate it with `npm install`." },
  { path: "dist/", include: false, why: "Generated by `npm run build`. Only commit it if your course explicitly asks for the built file." },
  { path: ".env  ·  API keys  ·  passwords", include: false, why: "Public repos are indexed within minutes. Never commit secrets." },
];

export interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

export const checklist: ChecklistItem[] = [
  {
    id: "chk-build",
    label: "`npm run build` finishes with no errors",
    detail: "Run it locally once more right before you push. A repo that doesn't build is the fastest way to lose marks.",
  },
  {
    id: "chk-readme",
    label: "README has a real title, description and your name",
    detail: "Replace every placeholder (YOUR-USERNAME, Project Title, Feature one…). Add a screenshot if you can.",
  },
  {
    id: "chk-gitignore",
    label: "No node_modules or dist in the repo",
    detail: "Check the file list on github.com. If either folder appears, see Troubleshooting → \"I pushed node_modules by accident\".",
  },
  {
    id: "chk-secrets",
    label: "No API keys, tokens or passwords committed",
    detail: "Search your code for 'key', 'token', 'secret'. If you ever committed one, revoke it — deleting the file does not remove it from history.",
  },
  {
    id: "chk-visibility",
    label: "Repository visibility matches the submission rules",
    detail: "Usually Public. If it must be Private, invite the grader under Settings → Collaborators, or they'll see a 404.",
  },
  {
    id: "chk-commits",
    label: "Commit messages make sense",
    detail: "A handful of descriptive commits ('Add navbar', 'Fix form validation') looks far better than one giant 'final final v2'.",
  },
  {
    id: "chk-incognito",
    label: "Submission link opens in a private/incognito window",
    detail: "That's exactly what the grader sees. Test both the repo URL and the GitHub Pages URL if you deployed.",
  },
  {
    id: "chk-tag",
    label: "(Optional) Create a release or tag for the submitted version",
    detail: "On GitHub: Releases → Draft a new release → tag `v1.0`. Proves exactly which version you submitted, even if you keep working on it.",
  },
];

export interface Trouble {
  id: string;
  problem: string;
  cause: string;
  fix: string;
  code?: string;
}

export const troubleshooting: Trouble[] = [
  {
    id: "t-nm",
    problem: "I pushed node_modules by accident — the repo is huge",
    cause: "The .gitignore was missing or added after the first `git add`. Git only ignores files it isn't already tracking.",
    fix: "Make sure .gitignore exists, untrack the folder (this doesn't delete it from your disk), commit, and push again.",
    code: 'git rm -r --cached node_modules dist\ngit add .\ngit commit -m "Remove build artifacts and dependencies from repo"\ngit push',
  },
  {
    id: "t-auth",
    problem: "Authentication failed / Support for password authentication was removed",
    cause: "GitHub stopped accepting account passwords over HTTPS in 2021.",
    fix: "Create a Personal Access Token (GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate, tick `repo`) and paste it when asked for a password. Easier long-term: install the GitHub CLI and run `gh auth login`, which handles credentials for you.",
    code: "gh auth login",
  },
  {
    id: "t-rejected",
    problem: "error: failed to push some refs / Updates were rejected",
    cause: "The GitHub repo already has a commit (usually because 'Add a README' was ticked when creating it), so histories diverged.",
    fix: "Pull the remote commit on top of yours, resolve the README conflict if prompted (keep yours), then push.",
    code: "git pull origin main --rebase --allow-unrelated-histories\ngit push -u origin main",
  },
  {
    id: "t-remote",
    problem: "fatal: remote origin already exists",
    cause: "You ran `git remote add origin` twice, or with a typo the first time.",
    fix: "Overwrite the remote URL instead of adding a new one.",
    code: "git remote set-url origin https://github.com/{{user}}/{{repo}}.git\ngit push -u origin main",
  },
  {
    id: "t-master",
    problem: "My branch is called master, but GitHub expects main",
    cause: "Older Git installs default to `master`.",
    fix: "Rename the branch before pushing. The deploy workflow also listens on `main`.",
    code: "git branch -M main\ngit push -u origin main",
  },
  {
    id: "t-pages",
    problem: "GitHub Pages shows a 404 or a blank page",
    cause: "Either the Pages source isn't set to GitHub Actions, the workflow hasn't finished, or it failed.",
    fix: "Go to Settings → Pages and set Source to 'GitHub Actions'. Then open the Actions tab: a yellow dot means it's still running (give it ~1–2 min); a red X means the build failed — click it to read the error (usually a TypeScript error that also shows up in `npm run build` locally). Note that this project's build is a single self-contained HTML file, so you do NOT need to change Vite's `base` option.",
  },
  {
    id: "t-hidden",
    problem: "I can't find .gitignore or the .github folder to upload them",
    cause: "Files starting with a dot are hidden by the operating system.",
    fix: "macOS Finder: press ⌘ + Shift + . (period). Windows Explorer: View → Show → Hidden items. Then drag them in like any other file/folder.",
  },
];

export const deployWorkflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v5`;

export const ghCliShortcut =
  "gh repo create {{repo}} --public --source=. --remote=origin --push";

export const stack = [
  { name: "React", version: "19" },
  { name: "TypeScript", version: "5.9" },
  { name: "Vite", version: "7" },
  { name: "Tailwind CSS", version: "4" },
  { name: "Node.js", version: "20.19+ / 22.12+" },
];
