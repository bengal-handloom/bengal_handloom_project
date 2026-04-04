import type { ReactNode } from "react";
import { requireUserPage } from "@/lib/requireUser";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireUserPage();
  return <DashboardShell>{children}</DashboardShell>;
}