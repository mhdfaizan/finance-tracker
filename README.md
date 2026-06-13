<div align="center">
  <br>
  <h1>💰 Personal Finance Tracker</h1>
  <p><strong>Track your money. Own your data. Stay in control.</strong></p>
  <br>
  <p>
    <a href="https://pft-beta.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live-Demo-18181B?style=for-the-badge&logo=vercel" alt="Live Demo">
    </a>
    <a href="https://nextjs.org" target="_blank">
      <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js 16">
    </a>
    <a href="https://tailwindcss.com" target="_blank">
      <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4">
    </a>
    <a href="https://developers.google.com/sheets/api" target="_blank">
      <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white" alt="Google Sheets">
    </a>
  </p>
  <br>
</div>

---

## ✨ Overview

A **personal finance tracker** that helps you monitor your expenses and income in real time. Built with simplicity in mind — no databases, no subscriptions, just a clean web app backed by Google Sheets.

🔗 **Live**: [pft-beta.vercel.app](https://pft-beta.vercel.app)

---

## 🚀 Features

### Phase 1 — MVP ✅

| Feature | Description |
|---------|-------------|
| **📊 Dashboard** | Monthly income vs expenses, balance, category breakdown, recent transactions |
| **💳 Expenses** | Add, edit, delete expenses with 8 categories + notes |
| **💰 Income** | Add, edit, delete income entries with custom sources |
| **🏷️ Categories** | Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other |
| **📱 Responsive** | Works on desktop and mobile |
| **🔒 Private** | Your data lives in your own Google Sheet |

### Phase 2 — Coming Soon

- 🔁 Fixed / recurring expenses
- 📄 Loans (given & taken)
- 📈 Basic investment tracking
- 🔍 Filtering & search

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Backend** | [Google Sheets API](https://developers.google.com/sheets/api) via `googleapis` |
| **Hosting** | [Vercel](https://vercel.com) (Hobby — free) |
| **Currency** | PKR (Rs) — single currency |

---

## 📁 Project Structure

```
finance-tracker/
├── app/
│   ├── layout.jsx             # Root layout
│   ├── page.jsx               # Dashboard
│   ├── expenses/              # Expense pages (list, add, edit)
│   ├── income/                # Income pages (list, add, edit)
│   └── api/                   # API routes (expenses, income, dashboard)
├── components/                # Reusable UI components
├── lib/                       # Core logic (Google Sheets, validation, constants)
├── public/                    # Static assets
├── .env.example               # Environment variable template
└── AGENTS.md                  # Full project context for AI agents
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Google Cloud](https://console.cloud.google.com) project with Sheets API enabled
- A Google Sheet to store data

### 1. Clone and install

```bash
git clone https://github.com/mhdfaizan/finance-tracker.git
cd finance-tracker
npm install
```

### 2. Set up Google Sheets

Create a service account and share a sheet with it:

[![Google Cloud Console](https://img.shields.io/badge/Google_Cloud_Console-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://console.cloud.google.com)

```bash
# Encode your service account JSON key
[System.Convert]::ToBase64String(
  [Text.Encoding]::UTF8.GetBytes(
    (Get-Content -Raw "path/to/key.json")
  )
)
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GOOGLE_SERVICE_ACCOUNT_KEY=<your-base64-encoded-key>
SHEET_ID=<your-google-sheet-id>
```

> **Sheet ID** is the long string in your sheet URL: `/spreadsheets/d/THIS_PART/edit`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mhdfaizan/finance-tracker)

Or manually:

```bash
npm i -g vercel
vercel login
vercel --prod --env GOOGLE_SERVICE_ACCOUNT_KEY=<key> --env SHEET_ID=<id>
```

---

## 📡 API

All data flows through Next.js API routes. Google Sheets is **never** accessed from the browser.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Monthly summary, category breakdown, recent 5 transactions |
| `GET` | `/api/expenses` | List all expenses |
| `POST` | `/api/expenses` | Create an expense |
| `GET` | `/api/expenses/[id]` | Get a single expense |
| `PUT` | `/api/expenses/[id]` | Update an expense |
| `DELETE` | `/api/expenses/[id]` | Delete an expense |
| `GET` | `/api/income` | List all income |
| `POST` | `/api/income` | Create an income entry |
| `GET` | `/api/income/[id]` | Get a single income entry |
| `PUT` | `/api/income/[id]` | Update an income entry |
| `DELETE` | `/api/income/[id]` | Delete an income entry |

---

## 📊 Google Sheets Structure

Data is stored in a single spreadsheet with automatically created sheets:

### Expenses Sheet

| id | userId | amount | category | date | note | createdAt | updatedAt |
|----|--------|--------|----------|------|------|-----------|-----------|

### Income Sheet

| id | userId | amount | source | date | note | createdAt | updatedAt |
|----|--------|--------|--------|------|------|-----------|-----------|

> Sheets are created automatically on first access. No manual setup required.

---

## 🧪 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx vercel deploy --prod --yes` | Deploy to Vercel |

---

## 🗺️ Roadmap

- [x] **Phase 1** — Expenses, Income, Dashboard (MVP)
- [ ] **Phase 2** — Fixed expenses, Loans, Investments, Search
- [ ] **Phase 3** — Mobile app (React Native / Expo)
- [ ] **Phase 4** — Multi-user with authentication
- [ ] **Phase 5** — Database migration (optional)

---

## 🤝 Contributing

This is a personal project, but suggestions and PRs are welcome!  
Feel free to open an [issue](https://github.com/mhdfaizan/finance-tracker/issues) or submit a pull request.

---

## 📄 License

MIT — Free to use, modify, and share.

---

<div align="center">
  <sub>Built with ❤️ using Next.js + Google Sheets</sub>
  <br>
  <sub>PKR · Single user · No database required</sub>
</div>
