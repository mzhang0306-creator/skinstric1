const BASE =
  "https://us-central1-frontend-simplified.cloudfunctions.net";

// Phase 1: send the user's name + location to the backend.
export async function submitPhaseOne(name: string, location: string) {
  const res = await fetch(`${BASE}/skinstricPhaseOne`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location }),
  });
  if (!res.ok) throw new Error("Phase one submission failed");
  return res.json();
}
