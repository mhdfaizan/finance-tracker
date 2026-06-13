<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Finance Tracker — Complete Project Context

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Backend**: Google Sheets (via `googleapis` SDK), NOT a database
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel Hobby (free)
- **Currency**: PKR (Rs) — single currency
- **Auth**: None in POC (userId="default" for future-proofing)
- **API Layer**: Next.js API routes (serverless functions)
- **Testing**: None yet (add in Phase 2)

## Deployment
- **Production URL**: https://pft-beta.vercel.app
- **Vercel Team**: mhd-fzn-projects-1
- **GitHub Repo**: https://github.com/mhdfaizan/finance-tracker
- **Deployment**: Manual via `vercel deploy --prod` (not connected to Git auto-deploy yet)

## Key Next.js 16 Breaking Changes Used

1. **`params` and `searchParams` are Promises** — must `await` them in server components, use `use()` from React in client components
2. **API route handlers** — use named exports `GET/POST/PUT/DELETE`, second arg `{ params }` is a Promise
3. **Client components** — use `import { use } from "react"` to unwrap Promises from props
4. **Dynamic routes** — `[id]` folder syntax
5. **Root layout** — MUST define `<html>` and `<body>` tags
6. **ESLint rule** — `react-hooks/set-state-in-effect` forbids calling setState synchronously in effects; use `.then()` chains instead of `async/await` inside effects

## Project Structure

```
finance-tracker/
├── app/
│   ├── layout.jsx              # Root layout (wraps <Layout> component)
│   ├── page.jsx                # Dashboard (client component)
│   ├── globals.css             # Tailwind v4 import
│   ├── expenses/
│   │   ├── page.jsx            # Expense list (client component)
│   │   ├── new/page.jsx        # Add expense (server component)
│   │   └── [id]/page.jsx       # Edit expense (client component, uses use(params))
│   ├── income/
│   │   ├── page.jsx            # Income list (client component)
│   │   ├── new/page.jsx        # Add income (server component)
│   │   └── [id]/page.jsx       # Edit income (client component, uses use(params))
│   └── api/
│       ├── expenses/
│       │   ├── route.js        # GET (list) + POST (create)
│       │   └── [id]/route.js   # GET + PUT + DELETE (params is Promise)
│       ├── income/
│       │   ├── route.js        # GET (list) + POST (create)
│       │   └── [id]/route.js   # GET + PUT + DELETE (params is Promise)
│       └── dashboard/
│           └── route.js        # GET (aggregated stats)
├── components/
│   ├── Layout.jsx              # Sidebar navigation (client component, uses usePathname)
│   ├── CategoryBadge.jsx       # Colored category pill
│   ├── ExpenseForm.jsx         # Add/edit expense form (client component)
│   ├── IncomeForm.jsx          # Add/edit income form (client component)
│   ├── ExpenseList.jsx         # Expense table with edit/delete (client component)
│   ├── IncomeList.jsx          # Income table with edit/delete (client component)
│   └── DashboardCards.jsx      # Summary cards + category breakdown + recent tx
├── lib/
│   ├── constants.js            # CATEGORIES, CURRENCY_SYMBOL, SHEETS, SHEET_HEADERS
│   ├── utils.js                # generateId, getTimestamp, validation, date helpers
│   └── googleSheets.js         # Google Sheets client + CRUD helpers (appendRow, readAll, findById, updateRow, deleteRow)
├── .env.local                  # Local env vars (gitignored)
├── .env.example                # Template for env vars
├── .gitignore                  # Includes .env*, google-sheets-json-key/
└── google-sheets-json-key/     # Service account JSON key (gitignored)
```

## Google Sheets Structure

Single spreadsheet (title: "finance-tracker-v1.1") with auto-created sheets:

### Sheet: "Expenses"
| id | userId | amount | category | date | note | createdAt | updatedAt |
|----|--------|--------|----------|------|------|-----------|-----------|

### Sheet: "Income"
| id | userId | amount | source | date | note | createdAt | updatedAt |
|----|--------|--------|--------|------|------|-----------|-----------|

### Fixed Categories
Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other

### Sheet Auto-creation
- `ensureSheet()` in googleSheets.js checks if sheets exist on first access
- Creates missing sheets with header row automatically
- Spreadsheet ID: `1_EsG63aQR1seTbj5CH87Cw_ldsJCIaQ_0pfxa4Q6_0w`

## API Endpoints

| Method | Endpoint | Description | Validation |
|--------|----------|-------------|------------|
| GET | `/api/dashboard` | Monthly totals, category breakdown, recent 5 transactions | None |
| GET | `/api/expenses` | List all expenses | None |
| POST | `/api/expenses` | Create expense (amount, category, date, note) | amount>0, valid category, date required |
| GET | `/api/expenses/[id]` | Get single expense | None |
| PUT | `/api/expenses/[id]` | Update expense | Same as POST |
| DELETE | `/api/expenses/[id]` | Delete expense (removes sheet row) | None |
| GET | `/api/income` | List all income entries | None |
| POST | `/api/income` | Create income (amount, source, date, note) | amount>0, source required, date required |
| GET | `/api/income/[id]` | Get single income entry | None |
| PUT | `/api/income/[id]` | Update income | Same as POST |
| DELETE | `/api/income/[id]` | Delete income (removes sheet row) | None |

## Google Sheets CRUD Implementation (lib/googleSheets.js)

- **Auth**: JWT via service account JSON (base64-decoded from env var)
- **`ensureSheet(sheetName)`**: Checks if sheet exists, creates with headers if missing
- **`appendRow(sheetName, data)`**: Appends row to sheet
- **`readAll(sheetName)`**: Reads all rows, converts to objects via header mapping
- **`findById(sheetName, id)`**: Reads all, finds by id in JS
- **`updateRow(sheetName, id, updates)`**: Finds row by id column, updates cells via range
- **`deleteRow(sheetName, id)`**: Finds row by id column, deletes entire row via batchUpdate

## Environment Variables (Set on Vercel)

- `GOOGLE_SERVICE_ACCOUNT_KEY` — base64-encoded service account JSON
  - Service Account Email: `g-sheet-connect-pft@finance-tracker-v2-499307.iam.gserviceaccount.com`
  - GCP Project: `finance-tracker-v2-499307`
- `SHEET_ID` — `1_EsG63aQR1seTbj5CH87Cw_ldsJCIaQ_0pfxa4Q6_0w`

### Setting locally
```powershell
# .env.local (gitignored, already set up)
GOOGLE_SERVICE_ACCOUNT_KEY=<base64>
SHEET_ID=1_EsG63aQR1seTbj5CH87Cw_ldsJCIaQ_0pfxa4Q6_0w
```

### Adding/updating on Vercel
```powershell
$env:Path = ...; Get-Content .env.local | ... | npx vercel env add GOOGLE_SERVICE_ACCOUNT_KEY production --force
$env:Path = ...; npx vercel deploy --prod --yes
```

## Session History (June 13, 2026)

### Phase 0 — Discovery
- Categories: Fixed (8 defaults)
- Currency: PKR (Rs), single
- Loans: Principal only (no interest)
- Investments: Basic manual
- Users: Single user (userId field for future)
- UI: Simple & functional
- Priority: Web-first (Next.js)
- Sheets: Simple flat structure
- Deployment: Vercel Hobby (free)

### Phase 1 — MVP Built
1. Scaffolded Next.js 16 + Tailwind CSS v4
2. Built Google Sheets data layer (CRUD helpers)
3. Built API routes (expenses, income, dashboard)
4. Built UI components (Layout, forms, lists, dashboard cards)
5. Verified: lint clean, build successful
6. GCP setup: Created service account, enabled Sheets API
7. Created Google Sheet, shared with service account
8. Verified end-to-end: local dev server works
9. Deployed to Vercel, configured env vars
10. Renamed project to `pft`, set domain to `pft-beta.vercel.app`
11. Cleaned up old deployments and aliases

### Project Name Evolution
- Originally: `finance-tracker-app` → `finance-tracker-app-five-lyart.vercel.app`
- Renamed to: `pft` → `pft-mhd-fzn-projects-1.vercel.app`
- Final domain: `pft-beta.vercel.app`

## Project Commands
- `npm run dev` — Development server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npx vercel deploy --prod --yes` — Deploy to Vercel
- `npx vercel env add KEY production` — Add env var to Vercel
- `npx vercel env ls` — List env vars
- `npx vercel alias rm domain.com --yes` — Remove a domain alias
- `npx vercel rm deployment-url --yes` — Remove a deployment
- `npx vercel list` — List deployments

## Phase 2 (Ready to Start)
- Fixed expenses (recurring, auto-rollover)
- Loans module (given/taken, principal only)
- Investments module (manual entries, basic P&L)
- Better filtering/search
- Connect GitHub repo to Vercel for auto-deploy

## Design Patterns to Follow

### Adding a new module
1. Add sheet name + headers to `lib/constants.js`
2. Add CRUD API routes in `app/api/[module]/`
3. Create components in `components/`
4. Create pages in `app/[module]/`
5. Update dashboard API to include new data

### Data fetching pattern (client components)
```jsx
useEffect(() => {
  let cancelled = false;
  fetch("/api/endpoint")
    .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
    .then((data) => { if (!cancelled) setData(data); })
    .catch((err) => { if (!cancelled) setError(err.message); })
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, []);
```

### Validation pattern (API routes)
```js
const errors = validateXxx(body);
if (errors.length > 0) {
  return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
}
```

### Record shape (every sheet)
```js
{ id, userId: "default", createdAt, updatedAt, ...fields }
```
