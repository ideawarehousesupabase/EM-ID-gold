import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/lib/auth";
import { AuthLayout, Field, inputCls } from "./signup";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — EM-ID Gold™" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Login to access your EM-ID Gold™ workspace.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Password">
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </Field>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <button disabled={loading} className="w-full bg-gold text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 transition disabled:opacity-60">
          {loading ? "Signing in…" : "Login"}
        </button>
        <div className="text-center text-sm text-muted-foreground">
          New here? <Link to="/signup" className="text-gold hover:underline">Create an account</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
