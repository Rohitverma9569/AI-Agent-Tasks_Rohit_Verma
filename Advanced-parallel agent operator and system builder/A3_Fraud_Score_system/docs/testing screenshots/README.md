# Testing Screenshots — A3 Fraud Scoring System

Swagger UI captures from local manual testing on **2026-06-21** · FastAPI at `http://127.0.0.1:8000/docs`

| # | File | Description |
| - | ---- | ----------- |
| 01 | [`01-post-high-15000-request.png`](01-post-high-15000-request.png) | POST — HIGH risk (amount 15,000 · user-rohit-01) |
| 02 | [`02-get-high-completed-169ba0a1.png`](02-get-high-completed-169ba0a1.png) | GET — `COMPLETED` · HIGH · score 0.92 |
| 03 | [`03-post-low-50-request.png`](03-post-low-50-request.png) | POST — LOW risk (amount 50 · user-rohit-02) |
| 04 | [`04-post-low-50-request-alt.png`](04-post-low-50-request-alt.png) | POST — LOW risk (amount 50 · second run) |
| 05 | [`05-post-medium-2500-request.png`](05-post-medium-2500-request.png) | POST — MEDIUM risk (amount 2,500 · user-rohit-03) |
| 06 | [`06-get-medium-completed-d70ca198.png`](06-get-medium-completed-d70ca198.png) | GET — `COMPLETED` · MEDIUM · score 0.45 |
| 07 | [`07-post-suspicious-merchant-sus999.png`](07-post-suspicious-merchant-sus999.png) | POST — merchant `SUS-999` (user-rohit-04) |
| 08 | [`08-get-suspicious-merchant-completed.png`](08-get-suspicious-merchant-completed.png) | GET — `COMPLETED` · MEDIUM · suspicious merchant |

See [`../local-testing.md`](../local-testing.md) for full request/response JSON and Node/Rust terminal evidence.
