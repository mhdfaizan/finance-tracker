"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/expenses", label: "Expenses", icon: "💳" },
  { href: "/income", label: "Income", icon: "💰" },
];

export default function Layout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 bg-zinc-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-zinc-700">
          <h1 className="text-lg font-bold">Finance Tracker</h1>
          <p className="text-xs text-zinc-400 mt-1">Personal Finance</p>
        </div>
        <div className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-zinc-700 text-xs text-zinc-500">
          v1.0 — POC
        </div>
      </nav>
      <main className="flex-1 bg-zinc-50 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
