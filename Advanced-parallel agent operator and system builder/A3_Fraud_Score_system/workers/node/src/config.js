import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../..");

export const config = {
  dbPath: process.env.FRAUD_DB_PATH || path.join(projectRoot, "data", "fraud.db"),
  rustEngineUrl: process.env.RUST_ENGINE_URL || "http://127.0.0.1:3001",
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS || 500),
};
