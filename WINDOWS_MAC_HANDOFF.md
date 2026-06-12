# Windows and macOS Handoff

## Repository Root

Use this folder as the repository root:

```text
C:\Users\home\Documents\리뷰렌즈
```

On macOS, clone the GitHub repository wherever you normally keep projects.

## Windows Setup

```powershell
npm ci
npm run dev
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd ci
npm.cmd run dev
```

## macOS Setup

```bash
nvm use
npm ci
npm run dev
```

If Node 22 is not installed:

```bash
nvm install 22
nvm use 22
```

## Before Pushing

```bash
npm run check
```

## Local URL

```text
http://127.0.0.1:3000
```

If port 3000 is busy:

```bash
npm run dev -- --port 3001
```

## Notes

- Do not commit `.env.local`.
- Do not commit `node_modules` or `.next`.
- Use `NEXT_STEPS.md` as the product and engineering queue.
