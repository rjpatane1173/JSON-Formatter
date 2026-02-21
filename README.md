# JSON Formatter Tool

> Pure frontend static app to validate & pretty-print JSON with an ad-gate.

Summary

- Simple static site: `index.html`, `style.css`, `script.js`.
- Upload or paste JSON, format with a short ad-overlay gate.
- Free-user limit: 100KB (102400 bytes).

Run locally (quick)

- Open `index.html` in a browser (double-click) for a quick test.
- Or run a local static server from PowerShell:

```powershell
# Using Python 3 (recommended when installed)
python -m http.server 8000
# or using Node http-server (if you have npm)
npx http-server -c-1 . 8080
```

Then open http://localhost:8000/ (or 8080) in your browser.

Deploy options

1. GitHub Pages (simple)

- Create a GitHub repo and push this folder.
- Enable Pages in repo settings (Source: `main` branch / `/ (root)`).
- After a few minutes your site will be available at `https://<your-user>.github.io/<repo>`.

Commands to initialize and push (run from repository root):

```powershell
git init
git add .
git commit -m "Initial JSON Formatter Tool"
# create empty repo on GitHub via web or gh CLI, then:
git branch -M main
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

2. Netlify (drag & drop or CLI)

- Quick: zip the folder and drag-and-drop the build into https://app.netlify.com/drop
- With Netlify CLI:

```powershell
npm i -g netlify-cli
netlify deploy --dir=. --prod
```

3. Vercel (CLI)

```powershell
npm i -g vercel
vercel --prod
```

Notes & future-ready hooks

- The ad-gate and size limit live entirely in `script.js` so you can:
  - Toggle a subscription flag (`isPro`) to bypass ads.
  - Increase `MAX_FREE_SIZE` for different tiers.
  - Move validation to backend by replacing `formatAndShow()` with an API call.
- Files to modify for behavior: `script.js` (logic), `style.css` (styling), `index.html` (UI).

Next steps I can do for you

- Initialize a git repo and create commit(s) locally.
- Generate branch and sample GitHub Actions to auto-deploy to GitHub Pages.
- Help deploy to Netlify/Vercel with live CLI session (you'll need to authenticate).
