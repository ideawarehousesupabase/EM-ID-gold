import type { Role } from "./auth";

export interface GoldBar {
  barId: string;
  serialNumber: string;
  weight: string;
  purity: string;
  manufacturer: string;
  fingerprintId: string;
  registrationDate: string;
  status: "Active" | "Vaulted" | "Pending";
}

export interface VerificationEntry {
  id: string;
  date: string;
  user: string;
  role: Role | string;
  barId: string;
  serialNumber?: string;
  result: "Verified" | "Failed";
  matchScore?: string;
}

const BARS_KEY = "emid_bars";
const VERIF_KEY = "emid_verifications";

const SEED_BARS: GoldBar[] = [
  {
    barId: "BAR-100001",
    serialNumber: "PAMP-2024-AX-7781",
    weight: "1000 g",
    purity: "999.9",
    manufacturer: "PAMP Suisse",
    fingerprintId: "EMID-839201-XA92",
    registrationDate: "2025-11-14",
    status: "Active",
  },
  {
    barId: "BAR-100002",
    serialNumber: "VAL-2025-BR-2240",
    weight: "400 oz",
    purity: "995.0",
    manufacturer: "Valcambi",
    fingerprintId: "EMID-552830-KQ41",
    registrationDate: "2025-12-02",
    status: "Vaulted",
  },
  {
    barId: "BAR-100003",
    serialNumber: "ARG-2025-LX-9982",
    weight: "100 g",
    purity: "999.9",
    manufacturer: "Argor-Heraeus",
    fingerprintId: "EMID-118472-DM73",
    registrationDate: "2026-01-18",
    status: "Active",
  },
  {
    barId: "BAR-100004",
    serialNumber: "MTL-2026-QZ-3318",
    weight: "500 g",
    purity: "999.5",
    manufacturer: "Metalor",
    fingerprintId: "EMID-720915-PL08",
    registrationDate: "2026-03-09",
    status: "Active",
  },
];

const SEED_VERIFS: VerificationEntry[] = [
  {
    id: "V-1",
    date: "2026-04-21 10:14",
    user: "Helena Vogt",
    role: "vault_operator",
    barId: "BAR-100001",
    result: "Verified",
    matchScore: "98.7%",
  },
  {
    id: "V-2",
    date: "2026-04-22 16:02",
    user: "Marcus Chen",
    role: "bullion_dealer",
    barId: "BAR-100002",
    result: "Verified",
    matchScore: "99.1%",
  },
  {
    id: "V-3",
    date: "2026-04-23 09:48",
    user: "Aliya Rahman",
    role: "auditor",
    barId: "UNKNOWN-XX",
    result: "Failed",
  },
];

function read<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(`${key}-change`));
}

export function getBars(): GoldBar[] {
  return read(BARS_KEY, SEED_BARS);
}

export function addBar(input: {
  serialNumber: string;
  weight: string;
  purity: string;
  manufacturer: string;
}): GoldBar {
  const bars = getBars();
  const nextNum = 100000 + bars.length + 1;
  const bar: GoldBar = {
    barId: `BAR-${nextNum}`,
    serialNumber: input.serialNumber,
    weight: input.weight,
    purity: input.purity,
    manufacturer: input.manufacturer,
    fingerprintId: generateFingerprint(),
    registrationDate: new Date().toISOString().slice(0, 10),
    status: "Active",
  };
  write(BARS_KEY, [bar, ...bars]);
  return bar;
}

export function generateFingerprint(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const a = letters[Math.floor(Math.random() * letters.length)];
  const b = letters[Math.floor(Math.random() * letters.length)];
  const code = Math.floor(10 + Math.random() * 90);
  return `EMID-${num}-${a}${b}${code}`;
}

export function getVerifications(): VerificationEntry[] {
  return read(VERIF_KEY, SEED_VERIFS);
}

export function addVerification(entry: Omit<VerificationEntry, "id" | "date">) {
  const all = getVerifications();
  const stamp = new Date();
  const date = `${stamp.toISOString().slice(0, 10)} ${stamp
    .toTimeString()
    .slice(0, 5)}`;
  const full: VerificationEntry = {
    ...entry,
    id: `V-${all.length + 1}-${Date.now()}`,
    date,
  };
  write(VERIF_KEY, [full, ...all]);
  return full;
}

export function findBar(query: string): GoldBar | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return getBars().find(
    (b) =>
      b.barId.toLowerCase() === q ||
      b.serialNumber.toLowerCase() === q ||
      b.fingerprintId.toLowerCase() === q
  );
}

export function mockScore(): string {
  const n = 96 + Math.random() * 3.9;
  return `${n.toFixed(1)}%`;
}
