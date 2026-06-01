import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Fingerprint, Database, BadgeCheck, Factory, Vault, Coins, ClipboardCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EM-ID Gold™ — Where Every Gold Bar Has a Verifiable Identity" },
      { name: "description", content: "EM-ID Gold™ assigns every gold bar a permanent identity by registering and verifying unique fingerprints throughout its lifecycle." },
      { property: "og:title", content: "EM-ID Gold™" },
      { property: "og:description", content: "Verifiable identity for every gold bar." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="font-display text-2xl gold-text-gradient font-semibold">
            EM-ID Gold™
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition px-4 py-2">
              Login
            </Link>
            <Link to="/signup" className="text-sm bg-gold text-primary-foreground font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full luxury-glow opacity-40" />
        <div className="max-w-5xl mx-auto px-6 py-32 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full luxury-border text-xs tracking-widest uppercase text-gold mb-8">
            <Fingerprint className="h-3.5 w-3.5" /> Electromagnetic Identity Registry
          </div>
          <h1 className="font-display text-6xl md:text-7xl leading-[1.05] font-medium">
            Where Every Gold Bar Has a
            <br />
            <span className="gold-text-gradient italic">Verifiable Identity</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            EM-ID Gold™ assigns every gold bar a permanent identity by registering
            and verifying unique fingerprints throughout its lifecycle.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/signup" className="bg-gold text-primary-foreground font-medium px-7 py-3.5 rounded-md hover:opacity-90 transition flex items-center gap-2">
              Sign Up <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="px-7 py-3.5 rounded-md luxury-border hover:bg-secondary transition">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] uppercase text-gold">Process</div>
            <h2 className="font-display text-4xl mt-3">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Register Gold Bar", d: "Capture serial, weight, purity and manufacturer metadata.", i: Database },
              { n: "02", t: "Assign Unique Fingerprint", d: "Generate a permanent EM-ID fingerprint for the bar.", i: Fingerprint },
              { n: "03", t: "Store Identity In Registry", d: "Persist the identity in a tamper-evident registry.", i: ShieldCheck },
              { n: "04", t: "Verify Anytime", d: "Re-verify the bar at any stage of its lifecycle.", i: BadgeCheck },
            ].map((s) => {
              const Icon = s.i;
              return (
                <div key={s.n} className="luxury-border bg-card rounded-lg p-7 relative">
                  <div className="text-xs font-mono text-gold-dim">{s.n}</div>
                  <Icon className="h-7 w-7 text-gold mt-3" />
                  <h3 className="font-display text-2xl mt-4">{s.t}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-t border-border py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] uppercase text-gold">Built For</div>
            <h2 className="font-display text-4xl mt-3">Target Industries</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { t: "Gold Manufacturers", d: "Register every bar at the source of production.", i: Factory },
              { t: "Vault Operators", d: "Verify and track every bar that enters the vault.", i: Vault },
              { t: "Bullion Dealers", d: "Confirm authenticity before every transaction.", i: Coins },
              { t: "Auditors", d: "Maintain a verifiable audit trail across the chain.", i: ClipboardCheck },
            ].map((c) => {
              const Icon = c.i;
              return (
                <div key={c.t} className="luxury-border bg-background rounded-lg p-7 hover:luxury-glow transition">
                  <Icon className="h-8 w-8 text-gold" />
                  <h3 className="font-display text-xl mt-4">{c.t}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{c.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 text-sm text-muted-foreground">
          <div>
            <div className="font-display text-xl gold-text-gradient">EM-ID Gold™</div>
            <div className="mt-2 text-xs">Verifiable identity for the precious metals industry.</div>
          </div>
          <div className="flex gap-8">
            <Link to="/login" className="hover:text-foreground">Login</Link>
            <Link to="/signup" className="hover:text-foreground">Sign Up</Link>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} EM-ID Gold™. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
