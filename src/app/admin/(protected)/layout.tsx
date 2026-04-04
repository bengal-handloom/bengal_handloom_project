import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/requireAdmin";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/merchant-request", label: "Merchant Requests" },
  { href: "/admin/fabrics", label: "Fabric catalog" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Redirects to /admin/login when not authenticated as admin
  const admin = await requireAdminPage();

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#bdb29e]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-[#262626] bg-[#111111] p-5">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-[#8e877c]">Admin Panel</p>
            <h1 className="mt-1 text-xl font-semibold text-[#c5a059]">Digital Loom</h1>
            <p className="mt-2 text-xs text-[#8e877c]">{admin.email ?? "Admin"}</p>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md border border-transparent px-3 py-2 text-sm text-[#d6cec1] hover:border-[#3a3a3a] hover:bg-[#171717] hover:text-[#f3e7d2]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <form action="/api/admin/session" method="post">
              {/* If you prefer proper logout endpoint, use DELETE via client fetch.
                  This is a placeholder button; replace with your logout flow. */}
            </form>
          </div>
        </aside>

        {/* Main content */}
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}