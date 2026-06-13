<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Finance Tracker — Project Context

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Backend**: Google Sheets (via `googleapis` SDK), NOT a database
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel Hobby (free)
- **Currency**: PKR (Rs) - single currency
- **Auth**: None in POC (userId="default" for future-proofing)

## Key Next.js 16 Rules
- `params` and `searchParams` are Promises — must `await` them
- In client components, use `use()` from React to unwrap promise props
- API routes use named exports: `export async function GET/POST/PUT/DELETE`
- Dynamic routes: `[id]` folder syntax
- Root layout MUST define `<html>` and `<body>` tags

## Phase 1 Modules (Complete)
- Expenses module (CRUD, 8 fixed categories)
- Income module (CRUD, multiple sources)
- Dashboard (monthly summary, category breakdown, recent transactions)

## Phase 2 (Next)
- Fixed expenses (recurring)
- Loans module (given/taken, principal only)
- Investments module (manual entries, basic P&L)

## Environment Variables
- `GOOGLE_SERVICE_ACCOUNT_KEY` — base64-encoded service account JSON
- `SHEET_ID` — Google Spreadsheet ID

## Project Commands
- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run lint` — ESLint check
