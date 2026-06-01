import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { addBar, type GoldBar } from "@/lib/mock-data";
import { useSession } from "@/hooks/use-session";
import { Field, inputCls } from "./signup";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/registry/new")({
  head: () => ({ meta: [{ title: "Register Gold Bar — EM-ID Gold™" }] }),
  component: () => (
    <AppShell>
      <RegisterBar />
    </AppShell>
  ),
});

function RegisterBar() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    serialNumber: "",
    weight: "",
    purity: "999.9",
    manufacturer: user?.fullName ?? "",
  });
  const [created, setCreated] = useState<GoldBar | null>(null);

  if (user && user.role !== "manufacturer") {
    return (
      <div className="luxury-border bg-card rounded-lg p-8 text-muted-foreground">
        Only Manufacturer accounts can register new gold bars.
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bar = addBar(form);
    setCreated(bar);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <div className="text-xs tracking-[0.3em] uppercase text-gold">Manufacturer</div>
        <h1 className="font-display text-5xl mt-2">Register New Gold Bar</h1>
        <p className="text-muted-foreground mt-2">Submit bar details to assign a permanent EM-ID fingerprint.</p>
      </div>

      {created ? (
        <div className="luxury-border bg-card rounded-xl p-8 luxury-glow space-y-5">
          <div className="flex items-center gap-3 text-success">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-medium">Bar successfully registered.</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Info label="Bar ID" value={created.barId} mono />
            <Info label="Fingerprint ID" value={created.fingerprintId} mono />
            <Info label="Serial Number" value={created.serialNumber} />
            <Info label="Registration Date" value={created.registrationDate} />
            <Info label="Weight" value={created.weight} />
            <Info label="Purity" value={created.purity} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setCreated(null); setForm({ serialNumber: "", weight: "", purity: "999.9", manufacturer: user?.fullName ?? "" }); }} className="luxury-border px-5 py-2.5 rounded-md hover:bg-secondary transition">
              Register Another
            </button>
            <button onClick={() => navigate({ to: "/registry" })} className="bg-gold text-primary-foreground font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition">
              View Registry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="luxury-border bg-card rounded-xl p-8 space-y-5">
          <Field label="Serial Number">
            <input required value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} className={inputCls} placeholder="e.g. PAMP-2026-XX-1234" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Weight">
              <input required value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputCls} placeholder="e.g. 1000 g" />
            </Field>
            <Field label="Purity">
              <input required value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })} className={inputCls} placeholder="e.g. 999.9" />
            </Field>
          </div>
          <Field label="Manufacturer Name">
            <input required value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className={inputCls} />
          </Field>
          <button className="w-full bg-gold text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 transition">
            Register Bar
          </button>
        </form>
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
