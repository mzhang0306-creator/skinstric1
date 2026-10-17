import type { Demographics } from "@/lib/api";

// Unambiguous alphabet — no 0/O/1/I/L to avoid transcription mistakes.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const CODES_KEY = "skinstric:codes";
const CURRENT_KEY = "skinstric:currentCode";
const DEMO_KEY = "skinstric:demographics";
const NAME_KEY = "skinstric:name";
const LOCATION_KEY = "skinstric:location";

export type Snapshot = {
  demographics: Demographics;
  name: string;
  location: string;
  savedAt: string;
};

export function generateCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase();
}

function readCodes(): Record<string, Snapshot> {
  try {
    return JSON.parse(localStorage.getItem(CODES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

// Save an analysis under a fresh unique code and make it the current result.
// Returns the generated code so the UI can show it.
export function saveAnalysis(demographics: Demographics): string {
  const map = readCodes();
  let code = generateCode();
  while (map[code]) code = generateCode();

  map[code] = {
    demographics,
    name: localStorage.getItem(NAME_KEY) ?? "",
    location: localStorage.getItem(LOCATION_KEY) ?? "",
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(CODES_KEY, JSON.stringify(map));
  localStorage.setItem(DEMO_KEY, JSON.stringify(demographics));
  localStorage.setItem(CURRENT_KEY, code);
  return code;
}

export function currentCode(): string {
  return localStorage.getItem(CURRENT_KEY) ?? "";
}

export function findByCode(code: string): Snapshot | null {
  return readCodes()[normalizeCode(code)] ?? null;
}

// Restore a saved result as the current one. Returns true if the code exists.
export function restoreByCode(code: string): boolean {
  const snap = findByCode(code);
  if (!snap) return false;
  const norm = normalizeCode(code);
  localStorage.setItem(DEMO_KEY, JSON.stringify(snap.demographics));
  localStorage.setItem(NAME_KEY, snap.name);
  localStorage.setItem(LOCATION_KEY, snap.location);
  localStorage.setItem(CURRENT_KEY, norm);
  return true;
}
