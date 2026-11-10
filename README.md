# Project Title

> One-sentence description of what this app does and who it's for.
> _(Replace this with your own summary before submitting.)_

**Live demo:** https://YOUR-USERNAME.github.io/YOUR-REPO/ _(available after enabling GitHub Pages — see below)_

---

## Features

- Feature one — what the user can do
- Feature two — what makes it useful
- Feature three — anything you're proud of

## Tech Stack

| Tool | Purpose |
| --- | --- |
| [React 19](https://react.dev) | UI components |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JavaScript |
| [Vite 7](https://vite.dev) | Dev server & production build |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) | Bundles the whole app into one self-contained `dist/index.html` |

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org) 20.19+ or 22.12+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

## Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with hot reload |
| `npm run build` | Builds the production app into `dist/` (a single `index.html`) |
| `npm run preview` | Serves the production build locally for a final check |

## Project Structure

```
.
├── .github/workflows/deploy.yml   # Auto-deploys to GitHub Pages on every push to main
├── index.html                     # HTML entry point
├── src/
│   ├── main.tsx                   # React bootstrap
│   ├── App.tsx                    # Root component
│   ├── index.css                  # Tailwind entry
│   ├── components/                # Reusable UI pieces
│   ├── data/                      # Static content / configuration
│   ├── hooks/                     # Custom React hooks
│   └── utils/                     # Helpers (e.g. `cn` class merger)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Deployment (GitHub Pages)

This repo ships with a GitHub Actions workflow that builds and deploys the app automatically.

1. Push the project to GitHub.
2. In the repository go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or re-run the workflow from the **Actions** tab).
5. Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Because the build is a single self-contained HTML file, no `base` path configuration is required.

## Author

**Your Name** — [@YOUR-USERNAME](https://github.com/YOUR-USERNAME)

## License

This project is submitted for educational purposes. _(Add a license such as MIT if you want others to reuse it.)_
