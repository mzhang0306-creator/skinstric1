// Phase 1 uses the frontend-simplified base (what the existing flow was built against).
const PHASE_ONE_BASE =
  "https://us-central1-frontend-simplified.cloudfunctions.net";

// Phase 2/3 use the Skinstric AI base from the project spec.
const PHASE_TWO_BASE =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net";

// Phase 1: send the user's name + location to the backend.
export async function submitPhaseOne(name: string, location: string) {
  const res = await fetch(`${PHASE_ONE_BASE}/skinstricPhaseOne`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location }),
  });
  if (!res.ok) throw new Error("Phase one submission failed");
  return res.json();
}

export type Scores = Record<string, number>;

export type Demographics = {
  race: Scores;
  age: Scores;
  gender: Scores;
};

type PhaseTwoResponse = {
  success?: boolean;
  message?: string;
  data?: Demographics;
};

// A data URL looks like "data:image/png;base64,AAAA" — the API wants only the
// part after the comma. Plain base64 strings are returned untouched.
export function stripDataUrl(input: string): string {
  const comma = input.indexOf(",");
  return input.startsWith("data:") && comma !== -1
    ? input.slice(comma + 1)
    : input;
}

// Phase 2/3: send a base64-encoded image, get back demographic predictions.
export async function submitPhaseTwo(image: string): Promise<Demographics> {
  const res = await fetch(`${PHASE_TWO_BASE}/skinstricPhaseTwo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: stripDataUrl(image) }),
  });
  if (!res.ok) throw new Error("Image analysis failed");
  const json: PhaseTwoResponse = await res.json();
  if (!json.data) throw new Error("Analysis returned no data");
  return json.data;
}
