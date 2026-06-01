import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type Role = "manufacturer" | "vault_operator" | "bullion_dealer" | "auditor";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

const SESSION_KEY = "emid_session";

export async function signUp(input: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}): Promise<SessionUser> {
  const existing = await getDocs(
    query(collection(db, "users"), where("email", "==", input.email))
  );
  if (!existing.empty) throw new Error("An account with this email already exists.");

  const docRef = await addDoc(collection(db, "users"), {
    fullName: input.fullName,
    email: input.email,
    password: input.password,
    role: input.role,
    createdAt: serverTimestamp(),
  });

  const user: SessionUser = {
    id: docRef.id,
    fullName: input.fullName,
    email: input.email,
    role: input.role,
  };
  setSession(user);
  return user;
}

export async function login(email: string, password: string): Promise<SessionUser> {
  const snap = await getDocs(
    query(collection(db, "users"), where("email", "==", email))
  );
  if (snap.empty) throw new Error("Invalid credentials");
  const match = snap.docs.find((d) => d.data().password === password);
  if (!match) throw new Error("Invalid credentials");
  const data = match.data();
  const user: SessionUser = {
    id: match.id,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
  };
  setSession(user);
  return user;
}

export async function updateProfile(
  userId: string,
  updates: { fullName?: string; password?: string }
) {
  await updateDoc(doc(db, "users", userId), updates);
  const current = getSession();
  if (current && updates.fullName) {
    setSession({ ...current, fullName: updates.fullName });
  }
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("emid-session-change"));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("emid-session-change"));
}

export const ROLE_LABELS: Record<Role, string> = {
  manufacturer: "Manufacturer",
  vault_operator: "Vault Operator",
  bullion_dealer: "Bullion Dealer",
  auditor: "Auditor",
};
