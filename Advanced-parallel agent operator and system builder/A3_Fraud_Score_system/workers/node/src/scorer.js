/**
 * Pure scoring mirror used only in unit tests.
 * Production path invokes the Rust engine via rustClient.
 */
export function scoreTransaction(payload) {
  let riskScore = "LOW";
  let scoreValue = 0.15;
  const reasons = [];

  if (payload.amount >= 10000) {
    riskScore = "HIGH";
    scoreValue = 0.92;
    reasons.push("amount_exceeds_high_threshold");
  } else if (payload.amount >= 1000) {
    riskScore = "MEDIUM";
    scoreValue = payload.amount >= 5000 ? 0.65 : 0.45;
    reasons.push(
      payload.amount >= 5000
        ? "amount_exceeds_medium_threshold"
        : "amount_exceeds_low_threshold",
    );
  } else {
    reasons.push("amount_within_normal_range");
  }

  if (payload.merchant_id?.startsWith("SUS")) {
    riskScore = riskScore === "LOW" ? "MEDIUM" : "HIGH";
    scoreValue = Math.min(scoreValue + 0.2, 0.99);
    reasons.push("suspicious_merchant_prefix");
  }

  return {
    transaction_id: payload.transaction_id,
    risk_score: riskScore,
    score_value: scoreValue,
    reasons,
  };
}
