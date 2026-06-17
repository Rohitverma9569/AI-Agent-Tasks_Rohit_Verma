use criterion::{black_box, criterion_group, criterion_main, Criterion, Throughput};
use fraud_engine::models::ScoreRequest;
use fraud_engine::scorer::{evaluate_risk, score_transaction};

fn sample_request(i: u64) -> ScoreRequest {
    ScoreRequest {
        transaction_id: format!("tx-{i}"),
        user_id: "user-1".to_string(),
        merchant_id: if i % 17 == 0 {
            "SUS-999".to_string()
        } else {
            "MERCH-100".to_string()
        },
        amount: 100.0 + (i % 20_000) as f64,
        currency: if i % 5 == 0 {
            "INR".to_string()
        } else {
            "USD".to_string()
        },
    }
}

fn bench_scoring(c: &mut Criterion) {
    let mut group = c.benchmark_group("score_transaction");
    group.throughput(Throughput::Elements(1));

    let requests: Vec<ScoreRequest> = (0..10_000).map(sample_request).collect();

    group.bench_function("10k_mixed_transactions_full", |b| {
        b.iter(|| {
            for req in &requests {
                black_box(score_transaction(black_box(req)));
            }
        });
    });

    group.bench_function("10k_mixed_transactions_rules_only", |b| {
        b.iter(|| {
            for req in &requests {
                black_box(evaluate_risk(black_box(req)));
            }
        });
    });

    group.finish();
}

criterion_group!(benches, bench_scoring);
criterion_main!(benches);
