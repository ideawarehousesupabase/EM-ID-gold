import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { getBars, type GoldBar } from "@/lib/mock-data";
import { Table, StatusPill, SectionTitle } from "./dashboard";
import { Search, X } from "lucide-react";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/registry/")({
  head: () => ({ meta: [{ title: "Identity Registry — EM-ID Gold™" }] }),
  component: () => (
    <AppShell>
      <Registry />
    </AppShell>
  ),
});

function Registry() {
  const { user } = useSession();
  const [bars, setBars] = useState<GoldBar[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<GoldBar | null>(null);

  useEffect(() => {
    setBars(getBars());
    const r = () => setBars(getBars());
    window.addEventListener("emid_bars-change", r);
    return () => window.removeEventListener("emid_bars-change", r);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return bars;
    return bars.filter(
      (b) =>
        b.barId.toLowerCase().includes(s) ||
        b.serialNumber.toLowerCase().includes(s) ||
        b.fingerprintId.toLowerCase().includes(s)
    );
  }, [bars, q]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold">Registry</div>
          <h1 className="font-display text-5xl mt-2">Identity Registry</h1>
          <p className="text-muted-foreground mt-2">Every gold bar with a verifiable EM-ID fingerprint.</p>
        </div>
        {user?.role === "manufacturer" && (
          <Link to="/registry/new" className="bg-gold text-primary-foreground font-medium px-5 py-3 rounded-md hover:opacity-90 transition">
            Register New Bar
          </Link>
        )}
      </div>

      <div className="luxury-border bg-card rounded-lg p-4 flex items-center gap-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by Bar ID, Serial Number, or Fingerprint ID…"
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Table head={["Bar ID", "Serial", "Weight", "Purity", "Manufacturer", "Fingerprint ID", "Status", ""]}>
        {filtered.map((b) => (
          <tr key={b.barId} className="border-b border-border/50 hover:bg-secondary/30">
            <td className="px-4 py-3 font-mono text-gold">{b.barId}</td>
            <td className="px-4 py-3">{b.serialNumber}</td>
            <td className="px-4 py-3">{b.weight}</td>
            <td className="px-4 py-3">{b.purity}</td>
            <td className="px-4 py-3">{b.manufacturer}</td>
            <td className="px-4 py-3 font-mono text-xs">{b.fingerprintId}</td>
            <td className="px-4 py-3"><StatusPill status={b.status} /></td>
            <td className="px-4 py-3 text-right">
              <button onClick={() => setSelected(b)} className="text-xs text-gold hover:underline">View Details</button>
            </td>
          </tr>
        ))}
        {filtered.length === 0 && (
          <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No bars match your search.</td></tr>
        )}
      </Table>

      {selected && <DetailsModal bar={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailsModal({ bar, onClose }: { bar: GoldBar; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="luxury-border bg-card rounded-xl max-w-2xl w-full p-8 luxury-glow" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs tracking-widest uppercase text-gold">Identity Record</div>
            <h2 className="font-display text-3xl mt-1">{bar.barId}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <SectionTitle title="Metadata" />
        <DefList items={[
          ["Serial Number", bar.serialNumber],
          ["Weight", bar.weight],
          ["Purity", bar.purity],
          ["Manufacturer", bar.manufacturer],
        ]} />

        <div className="mt-6"><SectionTitle title="Registration" /></div>
        <DefList items={[
          ["Registration Date", bar.registrationDate],
          ["Status", bar.status],
        ]} />

        <div className="mt-6"><SectionTitle title="Fingerprint" /></div>
        <div className="font-mono text-gold bg-background luxury-border rounded-md p-4">{bar.fingerprintId}</div>

        <div className="mt-6"><SectionTitle title="Verification History" /></div>
        <div className="text-sm text-muted-foreground">No verification events recorded for this bar in the current session.</div>
      </div>
    </div>
  );
}

function DefList({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
          <dd className="text-sm mt-0.5">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
