import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { addVerification, findBar, mockScore, type GoldBar } from "@/lib/mock-data";
import { useSession } from "@/hooks/use-session";
import { Field, inputCls } from "./signup";
import { ShieldCheck, ShieldAlert, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify Bar — EM-ID Gold™" }] }),
  component: () => (
    <AppShell>
      <Verify />
    </AppShell>
  ),
});

type Result =
  | { kind: "verified"; bar: GoldBar; score: string }
  | { kind: "failed"; query: string };

function Verify() {
  const { user } = useSession();
  const [serial, setSerial] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const q = (serial || fingerprint).trim();
    if (!q) return;
    const bar = findBar(q);
    if (bar) {
      const score = mockScore();
      setResult({ kind: "verified", bar, score });
      addVerification({
        user: user.fullName,
        role: user.role,
        barId: bar.barId,
        serialNumber: bar.serialNumber,
        result: "Verified",
        matchScore: score,
      });
    } else {
      setResult({ kind: "failed", query: q });
      addVerification({
        user: user.fullName,
        role: user.role,
        barId: q,
        result: "Failed",
      });
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="text-xs tracking-[0.3em] uppercase text-gold">Verification</div>
        <h1 className="font-display text-5xl mt-2">Verify Gold Bar</h1>
        <p className="text-muted-foreground mt-2">Enter a Serial Number or Fingerprint ID to verify a bar against the registry.</p>
      </div>

      <form onSubmit={onSubmit} className="luxury-border bg-card rounded-xl p-8 space-y-5">
        <Field label="Serial Number">
          <input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e.g. PAMP-2024-AX-7781" className={inputCls} />
        </Field>
        <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">— or —</div>
        <Field label="Fingerprint ID">
          <input value={fingerprint} onChange={(e) => setFingerprint(e.target.value)} placeholder="e.g. EMID-839201-XA92" className={inputCls} />
        </Field>
        <button className="w-full bg-gold text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 transition flex items-center justify-center gap-2">
          <Fingerprint className="h-4 w-4" /> Verify
        </button>
      </form>

      {result?.kind === "verified" && (
        <div className="rounded-xl p-8 border border-success/40 bg-success/10 space-y-4">
          <div className="flex items-center gap-3 text-success">
            <ShieldCheck className="h-7 w-7" />
            <div>
              <div className="font-display text-2xl">Verified — Match Found</div>
              <div className="text-sm opacity-80">This bar matches a record in the EM-ID Gold™ registry.</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
            <Info label="Bar ID" value={result.bar.barId} mono />
            <Info label="Match Score" value={result.score} mono />
            <Info label="Weight" value={result.bar.weight} />
            <Info label="Purity" value={result.bar.purity} />
            <Info label="Manufacturer" value={result.bar.manufacturer} />
            <Info label="Registration Date" value={result.bar.registrationDate} />
            <Info label="Fingerprint ID" value={result.bar.fingerprintId} mono />
            <Info label="Serial Number" value={result.bar.serialNumber} />
          </div>
        </div>
      )}

      {result?.kind === "failed" && (
        <div className="rounded-xl p-8 border border-destructive/40 bg-destructive/10">
          <div className="flex items-center gap-3 text-destructive">
            <ShieldAlert className="h-7 w-7" />
            <div>
              <div className="font-display text-2xl">No Match Found</div>
              <div className="text-sm opacity-90">Potential counterfeit. The identifier <span className="font-mono">{result.query}</span> does not match any registered bar.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 ${mono ? "font-mono text-gold" : ""}`}>{value}</div>
    </div>
  );
}
