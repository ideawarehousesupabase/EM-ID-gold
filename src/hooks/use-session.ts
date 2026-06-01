import { useEffect, useState } from "react";
import { getSession, type SessionUser } from "@/lib/auth";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setReady(true);
    const handler = () => setUser(getSession());
    window.addEventListener("emid-session-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("emid-session-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { user, ready };
}
