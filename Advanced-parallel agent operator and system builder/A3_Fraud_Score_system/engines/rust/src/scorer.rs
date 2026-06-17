use crate::models::{RiskLevel, ScoreRequest, ScoreResponse};

const REASON_AMOUNT_HIGH: &str = "amount_exceeds_high_threshold";
const REASON_AMOUNT_MEDIUM: &str = "amount_exceeds_medium_threshold";
const REASON_AMOUNT_LOW: &str = "amount_exceeds_low_threshold";
const REASON_AMOUNT_NORMAL: &str = "amount_within_normal_range";
const REASON_MERCHANT: &str = "suspicious_merchant_prefix";
const REASON_CURRENCY: &str = "non_standard_currency";

/// Rules-only evaluation using static reason tags (no response string allocations).
pub fn evaluate_risk(request: &ScoreRequest) -> (RiskLevel, f64, Vec<&'static str>) {
    let mut reasons = Vec::with_capacity(3);
    let mut level = RiskLevel::Low;
    let mut score_value = 0.15;

    if request.amount >= 10_000.0 {
        level = RiskLevel::High;
        score_value = 0.92;
        reasons.push(REASON_AMOUNT_HIGH);
    } else if request.amount >= 5_000.0 {
        level = RiskLevel::Medium;
        score_value = 0.65;
        reasons.push(REASON_AMOUNT_MEDIUM);
    } else if request.amount >= 1_000.0 {
        level = RiskLevel::Medium;
        score_value = 0.45;
        reasons.push(REASON_AMOUNT_LOW);
    } else {
        reasons.push(REASON_AMOUNT_NORMAL);
    }

    if request.merchant_id.starts_with("SUS") {
        level = bump_risk(level);
        score_value = f64::min(score_value + 0.2, 0.99);
        reasons.push(REASON_MERCHANT);
    }

    if !is_standard_currency(&request.currency) {
        level = bump_risk(level);
        score_value = f64::min(score_value + 0.1, 0.99);
        reasons.push(REASON_CURRENCY);
    }

    (level, score_value, reasons)
}

pub fn score_transaction(request: &ScoreRequest) -> ScoreResponse {
    let (level, score_value, reason_tags) = evaluate_risk(request);
    let mut reasons = Vec::with_capacity(reason_tags.len());
    for tag in reason_tags {
        reasons.push(tag.to_string());
    }

    ScoreResponse {
        transaction_id: request.transaction_id.clone(),
        risk_score: level.as_str().to_string(),
        score_value,
        reasons,
    }
}

#[inline]
fn is_standard_currency(currency: &str) -> bool {
    matches!(currency, "USD" | "EUR" | "GBP")
}

fn bump_risk(level: RiskLevel) -> RiskLevel {
    match level {
        RiskLevel::Low => RiskLevel::Medium,
        RiskLevel::Medium => RiskLevel::High,
        RiskLevel::High => RiskLevel::High,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::RiskLevel;

    fn sample_request(amount: f64, merchant_id: &str, currency: &str) -> ScoreRequest {
        ScoreRequest {
            transaction_id: "tx-001".to_string(),
            user_id: "user-1".to_string(),
            merchant_id: merchant_id.to_string(),
            amount,
            currency: currency.to_string(),
        }
    }

    #[test]
    fn low_amount_returns_low_risk() {
        let result = score_transaction(&sample_request(50.0, "MERCH-1", "USD"));
        assert_eq!(result.risk_score, RiskLevel::Low.as_str());
        assert!(result.score_value < 0.3);
    }

    #[test]
    fn high_amount_returns_high_risk() {
        let result = score_transaction(&sample_request(15_000.0, "MERCH-1", "USD"));
        assert_eq!(result.risk_score, RiskLevel::High.as_str());
    }

    #[test]
    fn suspicious_merchant_bumps_risk() {
        let result = score_transaction(&sample_request(50.0, "SUS-999", "USD"));
        assert_eq!(result.risk_score, RiskLevel::Medium.as_str());
        assert!(result.reasons.contains(&REASON_MERCHANT.to_string()));
    }

    #[test]
    fn medium_amount_returns_medium_risk() {
        let result = score_transaction(&sample_request(2_500.0, "MERCH-1", "USD"));
        assert_eq!(result.risk_score, RiskLevel::Medium.as_str());
    }
}
