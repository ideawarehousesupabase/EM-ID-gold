import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signUp, type Role } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — EM-ID Gold™" }] }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    role: "manufacturer" as Role,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Register to access the EM-ID Gold™ identity registry.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Full Name">
          <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password">
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Confirm Password">
            <input required type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Role">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className={inputCls}>
            <option value="manufacturer">Manufacturer</option>
            <option value="vault_operator">Vault Operator</option>
          </select>
        </Field>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <button disabled={loading} className="w-full bg-gold text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 transition disabled:opacity-60">
          {loading ? "Creating…" : "Create Account"}
        </button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-gold hover:underline">Login</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export const inputCls =
  "w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
      <div className="w-full max-w-md relative">
        <Link to="/" className="block text-center mb-8">
          <div className="font-display text-3xl gold-text-gradient font-semibold">EM-ID Gold™</div>
        </Link>
        <div className="luxury-border bg-card rounded-xl p-8 luxury-glow">
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
