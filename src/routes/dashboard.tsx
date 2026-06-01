import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { useSession } from "@/hooks/use-session";
import { getBars, getVerifications } from "@/lib/mock-data";
import { ROLE_LABELS } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Database, Fingerprint, ShieldCheck, ShieldAlert, ClipboardCheck, Coins } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EM-ID Gold™" }] }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const { user } = useSession();
  const [bars, setBars] = useState(() => (typeof window !== "undefined" ? getBars() : []));
  const [verifs, setVerifs] = useState(() => (typeof window !== "undefined" ? getVerifications() : []));

  useEffect(() => {
    setBars(getBars());
    setVerifs(getVerifications());
    const r1 = () => setBars(getBars());
    const r2 = () => setVerifs(getVerifications());
    window.addEventListener("emid_bars-change", r1);
    window.addEventListener("emid_verifications-change", r2);
    return () => {
      window.removeEventListener("emid_bars-change", r1);
      window.removeEventListener("emid_verifications-change", r2);
    };
  }, []);

  if (!user) return null;

  const verified = verifs.filter((v) => v.result === "Verified").length;
  const failed = verifs.filter((v) => v.result === "Failed").length;

  return (
    <div className="space-y-10">
      <div>
        <div className="text-xs tracking-[0.3em] uppercase text-gold">{ROLE_LABELS[user.role]} Workspace</div>
        <h1 className="font-display text-5xl mt-2">Welcome, {user.fullName.split(" ")[0]}.</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Your overview of registered identities and verification activity across the EM-ID Gold™ registry.
        </p>
      </div>

      {user.role === "manufacturer" && (
        <>
          <div className="grid md:grid-cols-3 gap-5">
            <StatCard label="Total Registered Bars" value={bars.length} icon={Database} />
            <StatCard label="Recent Registrations" value={bars.slice(0, 7).length} hint="Last 7 entries" icon={Fingerprint} />
            <StatCard label="Verification Requests" value={verifs.length} icon={ShieldCheck} />
          </div>
          <RecentBarsTable />
          <div>
            <Link to="/registry/new" className="inline-flex items-center gap-2 bg-gold text-primary-foreground px-5 py-3 rounded-md font-medium hover:opacity-90 transition">
              Register a New Gold Bar
            </Link>
          </div>
        </>
      )}

      {user.role === "vault_operator" && (
        <>
          <div className="grid md:grid-cols-3 gap-5">
            <StatCard label="Total Verifications" value={verifs.length} icon={ShieldCheck} />
            <StatCard label="Verified Bars" value={verified} icon={Fingerprint} />
            <StatCard label="Failed Verifications" value={failed} icon={ShieldAlert} />
          </div>
          <RecentVerificationsTable />
        </>
      )}

      {user.role === "bullion_dealer" && (
        <>
          <div className="grid md:grid-cols-3 gap-5">
            <StatCard label="Verification Requests" value={verifs.length} icon={Coins} />
            <StatCard label="Verified Transactions" value={verified} icon={ShieldCheck} />
            <StatCard label="Failed Verifications" value={failed} icon={ShieldAlert} />
          </div>
          <RecentVerificationsTable />
        </>
      )}

      {user.role === "auditor" && (
        <>
          <div className="grid md:grid-cols-3 gap-5">
            <StatCard label="Total Audits" value={verifs.length} icon={ClipboardCheck} />
            <StatCard label="Successful Matches" value={verified} icon={ShieldCheck} />
            <StatCard label="Failed Matches" value={failed} icon={ShieldAlert} />
          </div>
          <AuditLogsTable />
        </>
      )}
    </div>
  );
}

function RecentBarsTable() {
  const bars = getBars().slice(0, 6);
  return (
    <section>
      <SectionTitle title="Registered Bars" subtitle="Most recent entries in your registry" />
      <Table
        head={["Bar ID", "Serial Number", "Weight", "Purity", "Fingerprint ID", "Registered", "Status"]}
      >
        {bars.map((b) => (
          <tr key={b.barId} className="border-b border-border/50 hover:bg-secondary/30">
            <td className="px-4 py-3 font-mono text-gold">{b.barId}</td>
            <td className="px-4 py-3">{b.serialNumber}</td>
            <td className="px-4 py-3">{b.weight}</td>
            <td className="px-4 py-3">{b.purity}</td>
            <td className="px-4 py-3 font-mono text-xs">{b.fingerprintId}</td>
            <td className="px-4 py-3">{b.registrationDate}</td>
            <td className="px-4 py-3"><StatusPill status={b.status} /></td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

function RecentVerificationsTable() {
  const rows = getVerifications().slice(0, 6);
  return (
    <section>
      <SectionTitle title="Recent Verifications" subtitle="Latest verification activity" />
      <Table head={["Date", "User", "Bar ID", "Result", "Score"]}>
        {rows.map((v) => (
          <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30">
            <td className="px-4 py-3">{v.date}</td>
            <td className="px-4 py-3">{v.user}</td>
            <td className="px-4 py-3 font-mono text-gold">{v.barId}</td>
            <td className="px-4 py-3"><ResultPill result={v.result} /></td>
            <td className="px-4 py-3">{v.matchScore ?? "—"}</td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

function AuditLogsTable() {
  const rows = getVerifications();
  function exportCsv() {
    const header = ["Date", "User", "Role", "Bar ID", "Result"];
    const lines = [header.join(",")].concat(
      rows.map((r) => [r.date, r.user, r.role, r.barId, r.result].join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <SectionTitle title="Audit Logs" subtitle="Complete history of verification attempts" inline />
        <button onClick={exportCsv} className="text-sm luxury-border px-4 py-2 rounded-md hover:bg-secondary transition">
          Export CSV
        </button>
      </div>
      <Table head={["Date", "User", "Bar ID", "Result"]}>
        {rows.map((v) => (
          <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30">
            <td className="px-4 py-3">{v.date}</td>
            <td className="px-4 py-3">{v.user}</td>
            <td className="px-4 py-3 font-mono text-gold">{v.barId}</td>
            <td className="px-4 py-3"><ResultPill result={v.result} /></td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

export function SectionTitle({ title, subtitle, inline }: { title: string; subtitle?: string; inline?: boolean }) {
  return (
    <div className={inline ? "" : "mb-4"}>
      <h2 className="font-display text-2xl">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="luxury-border rounded-lg overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              {head.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full luxury-border text-gold bg-accent/40">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {status}
    </span>
  );
}

export function ResultPill({ result }: { result: "Verified" | "Failed" }) {
  const ok = result === "Verified";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
        ok ? "text-success border-success/40 bg-success/10" : "text-destructive border-destructive/40 bg-destructive/10"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-destructive"}`} /> {result}
    </span>
  );
}
