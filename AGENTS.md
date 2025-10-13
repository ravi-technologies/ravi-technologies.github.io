# Repository Guidelines

## Project Structure & Module Organization
- `index.html` contains the landing page markup, including inline scripts for waitlist handling and responsive navigation.
- `styles.css` stores global styles, color tokens, and component layouts; update this file for any visual change.
- `script.js` holds progressive enhancement logic (smooth scrolling, feature animations). Keep DOM-ready work here unless a component needs inline scripts.
- `CNAME` is required for the deployed domain and must remain untouched.

## Build, Test, and Development Commands
- Local preview: `python3 -m http.server 8000` from the repo root to serve the static site at `http://localhost:8000`.
- Link checking: `npx linkinator http://localhost:8000` helps spot broken anchors before publishing (install once with `npm install -g linkinator` if needed).

## Coding Style & Naming Conventions
- Use soft 4-space indentation in HTML, CSS, and JS for consistency with existing files.
- Favor descriptive class names (e.g., `hero-cta`, `benefits-grid`) and keep new IDs kebab-case.
- Keep assets and copy in ASCII unless product requirements mandate otherwise. Escape apostrophes instead of relying on smart quotes.
- Add concise comments only when logic is non-obvious (e.g., outlining throttled event handlers).

## Testing Guidelines
- Manual checks: verify hero CTA, waitlist submission feedback, and mobile nav toggling across desktop and mobile breakpoints.
- Form flow: submit a test email and confirm the success message renders and auto-clears.
- If you add JS, smoke-test in at least one Chromium and one WebKit-based browser to catch compatibility issues.

## Commit & Pull Request Guidelines
- Craft commits in the imperative mood, referencing the scope (e.g., `Refine hero messaging for system context`).
- Each PR should summarize the change, list visual or behavioral impacts, and attach screenshots or screencasts when UI shifts occur.
- Link relevant issues and describe manual verification steps so reviewers can reproduce your test pass quickly.
