const { Pool } = require("pg");

const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || "2000", 10);

const pool = new Pool({
  host: process.env.DATABASE_HOST || "db",
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  user: process.env.DATABASE_USER || "appuser",
  password: process.env.DATABASE_PASSWORD || "appsecret",
  database: process.env.DATABASE_NAME || "appdb",
});

async function waitForDatabase() {
  let retries = 30;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log("[worker] connected to PostgreSQL at", process.env.DATABASE_HOST || "db");
      return;
    } catch {
      retries -= 1;
      console.log(`[worker] waiting for database... (${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("database unavailable after retries");
}

async function processNextJob() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const claim = await client.query(
      `SELECT id, title, payload FROM jobs
       WHERE status = 'pending'
       ORDER BY created_at ASC
       LIMIT 1
       FOR UPDATE SKIP LOCKED`
    );

    if (claim.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    const job = claim.rows[0];
    console.log(`[worker] claimed job id=${job.id} title="${job.title}" from database`);

    await client.query("UPDATE jobs SET status = 'processing' WHERE id = $1", [job.id]);
    await client.query("COMMIT");

    const payload = typeof job.payload === "string" ? JSON.parse(job.payload) : job.payload;
    const result = `processed:${payload.action || "default"} at ${new Date().toISOString()}`;

    await new Promise((r) => setTimeout(r, 500));

    await client.query(
      "UPDATE jobs SET status = 'completed', result = $1 WHERE id = $2",
      [result, job.id]
    );

    console.log(`[worker] completed job id=${job.id} result="${result}"`);
    return true;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[worker] processing error:", err.message);
    return false;
  } finally {
    client.release();
  }
}

async function pollLoop() {
  console.log(`[worker] starting poll loop (interval=${POLL_INTERVAL_MS}ms)`);
  while (true) {
    const processed = await processNextJob();
    if (!processed) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
  }
}

async function start() {
  await waitForDatabase();
  await pollLoop();
}

start().catch((err) => {
  console.error("[worker] fatal startup error:", err);
  process.exit(1);
});
