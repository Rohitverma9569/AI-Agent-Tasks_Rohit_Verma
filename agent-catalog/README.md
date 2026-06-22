# PML Agent Catalog

Next.js frontend that displays all Cursor agents from this monorepo.

## Live site

https://agent-catalog.vercel.app

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

Agent data is regenerated from `../**/agent.md` on `predev` and `prebuild`. The generator also detects per-project **README**, **STATUS**, **local-testing**, and **validation-results** files, and marks runnable demos (B4, B5, B6, I4, A3) with test evidence aligned to `docs/runnable-projects.md`.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Set **Root Directory** to `agent-catalog`.
4. Deploy.

Or use the CLI:

```bash
npx vercel --prod
```
