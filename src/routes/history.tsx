import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { getVerifications, type VerificationEntry } from "@/lib/mock-data";
import { ROLE_LABELS, type Role } from "@/lib/auth";
import { Table, ResultPill } from "./dashboard";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Verification History — EM-ID Gold™" }] }),
  component: () => (
    <AppShell>
      <History />
    </AppShell>
  ),
});

function roleLabel(r: string) {
  return (ROLE_LABELS as Record<string, string>)[r as Role] ?? r;
}

function History() {
  const [rows, setRows] = useState<VerificationEntry[]>([]);
  useEffect(() => {
    setRows(getVerifications());
    const r = () => setRows(getVerifications());
    window.addEventListener("emid_verifications-change", r);
    return () => window.removeEventListener("emid_verifications-change", r);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs tracking-[0.3em] uppercase text-gold">Activity</div>
        <h1 className="font-display text-5xl mt-2">Verification History</h1>
        <p className="text-muted-foreground mt-2">Chronological log of all verification attempts.</p>
      </div>

      <Table head={["Date", "User", "Role", "Bar ID", "Result"]}>
        {rows.map((v) => (
          <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30">
            <td className="px-4 py-3">{v.date}</td>
            <td className="px-4 py-3">{v.user}</td>
            <td className="px-4 py-3 text-gold">{roleLabel(v.role)}</td>
            <td className="px-4 py-3 font-mono text-gold">{v.barId}</td>
            <td className="px-4 py-3"><ResultPill result={v.result} /></td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No verification activity yet.</td></tr>
        )}
      </Table>
    </div>
  );
}
