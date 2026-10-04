"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, Users, ClipboardList, Wallet, X, Database, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types/auth";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const links = (role?: string) => role === "ADMIN" ? [{ href: "/admin", label: "Overview", icon: LayoutDashboard }, { href: "/admin/users", label: "Users", icon: Users }, { href: "/admin/applications", label: "Applications", icon: ShieldCheck }, { href: "/admin/reports", label: "Audit reports", icon: ClipboardList }] : role === "RECRUITER" ? [{ href: "/provider", label: "Workspace", icon: LayoutDashboard }, { href: "/provider/assessments", label: "Assessments", icon: ClipboardList }, { href: "/provider/problems", label: "Problem library", icon: Database }, { href: "/provider/earnings", label: "Payments", icon: Wallet }, { href: "/provider/profile", label: "Company profile", icon: UserRound }] : [{ href: "/dashboard", label: "My dashboard", icon: LayoutDashboard }, { href: "/dashboard/assessments", label: "Assessments", icon: ClipboardList }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user); const setUser = useAuthStore((s) => s.setUser); const clearAuth = useAuthStore((s) => s.clearAuth); const router = useRouter(); const path = usePathname(); const [open, setOpen] = useState(false);
  useEffect(() => { if (!user) { void authApi.me().then((profile) => setUser({ ...profile, role: profile.role as UserRole })).catch(() => undefined); } }, [setUser, user]);
  const signOut = async () => { try { await authApi.logout(); } catch { /* already logged out */ } clearAuth(); document.cookie = "dap-auth=; Max-Age=0; path=/"; router.push("/login"); toast.success("You have been signed out"); };
  const nav = links(user?.role);
  return <div className="min-h-screen bg-[#f7f8fa] text-slate-900"><aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white p-6 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between"><Link href="/" className="text-xl font-black tracking-tight text-indigo-600">dev/assess</Link><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div><div className="mt-10 space-y-1">{nav.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${path === item.href ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}><Icon size={18} />{item.label}</Link>; })}<Link href="/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"><Settings size={18} />Profile settings</Link></div><div className="absolute bottom-6 left-6 right-6 border-t pt-5"><div className="mb-4 text-sm"><p className="font-bold">{user?.name ?? "Workspace"}</p><p className="text-xs text-slate-400">{user?.email}</p></div><button onClick={signOut} className="flex items-center gap-2 text-sm font-semibold text-rose-600"><LogOut size={17} />Sign out</button></div></aside><div className="lg:pl-72"><header className="flex h-16 items-center border-b border-slate-200 bg-white/80 px-5 backdrop-blur lg:hidden"><button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button><span className="ml-4 font-bold">dev/assess</span></header>{children}</div></div>;
}
