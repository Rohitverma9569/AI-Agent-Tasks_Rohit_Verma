use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct ScoreRequest {
    pub transaction_id: String,
    pub user_id: String,
    pub merchant_id: String,
    pub amount: f64,
    pub currency: String,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

impl RiskLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            RiskLevel::Low => "LOW",
            RiskLevel::Medium => "MEDIUM",
            RiskLevel::High => "HIGH",
        }
    }
}

#[derive(Debug, Clone, Serialize, PartialEq)]
pub struct ScoreResponse {
    pub transaction_id: String,
    pub risk_score: String,
    pub score_value: f64,
    pub reasons: Vec<String>,
}
