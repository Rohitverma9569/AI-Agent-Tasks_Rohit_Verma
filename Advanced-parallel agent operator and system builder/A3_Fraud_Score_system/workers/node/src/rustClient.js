/** Client wrapper for Rust engine — mirrors contract in contracts/risk-score.schema.json */
export async function invokeRustEngine(rustEngineUrl, payload) {
  const response = await fetch(`${rustEngineUrl}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Rust engine error ${response.status}: ${text}`);
  }

  return response.json();
}
