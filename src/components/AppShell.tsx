import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useSession } from "@/hooks/use-session";
import { clearSession, ROLE_LABELS } from "@/lib/auth";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  History,
  User,
  LogOut,
  PlusCircle,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/registry", label: "Identity Registry", icon: Database },
  { to: "/verify", label: "Verify Bar", icon: ShieldCheck },
  { to: "/history", label: "Verification History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, ready } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <Link to="/dashboard" className="px-6 py-6 border-b border-border block">
          <div className="font-display text-2xl gold-text-gradient font-semibold leading-none">
            EM-ID Gold™
          </div>
          <div className="text-[10px] tracking-[0.25em] text-muted-foreground mt-2 uppercase">
            Verifiable Identity
          </div>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-accent text-gold luxury-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {user.role === "manufacturer" && (
            <Link
              to="/registry/new"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                pathname === "/registry/new"
                  ? "bg-accent text-gold luxury-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              Register Bar
            </Link>
          )}
        </nav>

        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="text-sm font-medium truncate">{user.fullName}</div>
          <div className="text-xs text-gold mt-0.5">{ROLE_LABELS[user.role]}</div>
          <button
            onClick={() => {
              clearSession();
              navigate({ to: "/login" });
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs py-2 rounded-md border border-border hover:bg-secondary transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
