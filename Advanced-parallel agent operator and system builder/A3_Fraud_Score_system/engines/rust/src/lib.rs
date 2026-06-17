pub mod models;
pub mod scorer;

use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use models::{ScoreRequest, ScoreResponse};
use scorer::score_transaction;
use std::sync::Arc;
use tracing::info;

#[derive(Clone)]
pub struct AppState {
    pub service_name: String,
}

pub fn build_router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/score", post(score_handler))
        .with_state(Arc::new(state))
}

async fn health(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok",
        "service": state.service_name
    }))
}

async fn score_handler(Json(payload): Json<ScoreRequest>) -> Result<Json<ScoreResponse>, StatusCode> {
    if payload.transaction_id.is_empty()
        || payload.user_id.is_empty()
        || payload.merchant_id.is_empty()
        || payload.amount <= 0.0
        || payload.currency.len() != 3
    {
        return Err(StatusCode::BAD_REQUEST);
    }

    info!(
        transaction_id = %payload.transaction_id,
        amount = payload.amount,
        "scoring transaction"
    );

    Ok(Json(score_transaction(&payload)))
}
