const express = require("express");
const { Pool } = require("pg");

const PORT = parseInt(process.env.PORT || "8080", 10);

const pool = new Pool({
  host: process.env.DATABASE_HOST || "db",
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  user: process.env.DATABASE_USER || "appuser",
  password: process.env.DATABASE_PASSWORD || "appsecret",
  database: process.env.DATABASE_NAME || "appdb",
});

const app = express();
app.use(express.json());

async function checkDatabase() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}

app.get("/health", async (_req, res) => {
  try {
    await checkDatabase();
    console.log("[api] health check — database connection OK");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error("[api] health check failed:", err.message);
    res.status(503).json({ status: "error", database: "disconnected", error: err.message });
  }
});

app.get("/jobs", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, payload, status, result, created_at, updated_at FROM jobs ORDER BY id ASC"
    );
    console.log(`[api] GET /jobs — returned ${result.rowCount} rows from database`);
    res.json({ jobs: result.rows });
  } catch (err) {
    console.error("[api] GET /jobs failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/jobs/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, payload, status, result, created_at, updated_at FROM jobs WHERE id = $1",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "job not found" });
    }
    console.log(`[api] GET /jobs/${req.params.id} — status=${result.rows[0].status}`);
    res.json({ job: result.rows[0] });
  } catch (err) {
    console.error("[api] GET /jobs/:id failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/jobs", async (req, res) => {
  const { title, payload } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, payload, status) VALUES ($1, $2, 'pending') RETURNING id, title, payload, status, created_at",
      [title, JSON.stringify(payload || {})]
    );
    const job = result.rows[0];
    console.log(`[api] POST /jobs — created job id=${job.id} title="${job.title}" in database`);
    res.status(201).json({ job });
  } catch (err) {
    console.error("[api] POST /jobs failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  let retries = 30;
  while (retries > 0) {
    try {
      await checkDatabase();
      console.log("[api] connected to PostgreSQL at", process.env.DATABASE_HOST || "db");
      break;
    } catch (err) {
      retries -= 1;
      console.log(`[api] waiting for database... (${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  app.listen(PORT, () => {
    console.log(`[api] listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("[api] fatal startup error:", err);
  process.exit(1);
});
