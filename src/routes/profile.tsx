import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { ROLE_LABELS, updateProfile } from "@/lib/auth";
import { Field, inputCls } from "./signup";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — EM-ID Gold™" }] }),
  component: () => (
    <AppShell>
      <Profile />
    </AppShell>
  ),
});

function Profile() {
  const { user } = useSession();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setFullName(user.fullName);
  }, [user]);

  if (!user) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setBusy(true);
    try {
      const updates: { fullName?: string; password?: string } = {};
      if (fullName.trim() && fullName.trim() !== user.fullName) updates.fullName = fullName.trim();
      if (password) {
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        updates.password = password;
      }
      if (Object.keys(updates).length === 0) {
        setError("No changes to save.");
        return;
      }
      await updateProfile(user.id, updates);
      setSavedAt(Date.now());
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <div className="text-xs tracking-[0.3em] uppercase text-gold">Account</div>
        <h1 className="font-display text-5xl mt-2">Profile</h1>
      </div>

      <div className="luxury-border bg-card rounded-xl p-8 space-y-2">
        <Row label="Name" value={user.fullName} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value={ROLE_LABELS[user.role]} />
      </div>

      <form onSubmit={save} className="luxury-border bg-card rounded-xl p-8 space-y-5">
        <h2 className="font-display text-2xl">Update Profile</h2>
        <Field label="Full Name">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
        </Field>
        <Field label="New Password (leave blank to keep current)">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </Field>
        {error && <div className="text-sm text-destructive">{error}</div>}
        {savedAt && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> Profile updated.
          </div>
        )}
        <button disabled={busy} className="bg-gold text-primary-foreground font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition disabled:opacity-60">
          {busy ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
