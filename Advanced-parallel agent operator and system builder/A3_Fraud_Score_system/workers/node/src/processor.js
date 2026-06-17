import { claimNextJob, completeJob, failJob } from "./db.js";
import { invokeRustEngine } from "./rustClient.js";

export async function processNextJob(db, rustEngineUrl) {
  const job = claimNextJob(db);
  if (!job) {
    return false;
  }

  try {
    const score = await invokeRustEngine(rustEngineUrl, job.payload);
    completeJob(db, job.queueId, job.transactionId, score);
    console.log(
      `Processed ${job.transactionId} -> ${score.risk_score} (${score.score_value})`,
    );
    return true;
  } catch (error) {
    failJob(db, job.queueId, job.transactionId, error.message);
    return true;
  }
}
