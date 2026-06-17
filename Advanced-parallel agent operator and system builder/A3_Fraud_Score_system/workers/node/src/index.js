import path from "node:path";
import { pathToFileURL } from "node:url";

import { config } from "./config.js";
import { openDatabase } from "./db.js";
import { processNextJob } from "./processor.js";

export function startWorker(options = {}) {
  const dbPath = options.dbPath || config.dbPath;
  const rustEngineUrl = options.rustEngineUrl || config.rustEngineUrl;
  const pollIntervalMs = options.pollIntervalMs || config.pollIntervalMs;

  const db = openDatabase(dbPath);
  console.log(`Node worker started — db=${dbPath}, rust=${rustEngineUrl}`);

  const timer = setInterval(async () => {
    try {
      await processNextJob(db, rustEngineUrl);
    } catch (error) {
      console.error("Worker loop error:", error.message);
    }
  }, pollIntervalMs);

  function shutdown() {
    clearInterval(timer);
    db.close();
  }

  return { shutdown, db };
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  const worker = startWorker();
  const stop = () => {
    worker.shutdown();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
