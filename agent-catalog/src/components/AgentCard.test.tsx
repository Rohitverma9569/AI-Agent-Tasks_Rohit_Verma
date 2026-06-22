import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Agent } from "@/types/agent";

function badgeLabels(agent: Agent): string[] {
  const labels: string[] = [];
  if (agent.status === "complete") labels.push("Complete");
  if (agent.type === "runnable") labels.push("Runnable");
  if (agent.runnable?.testSummary) labels.push(agent.runnable.testSummary);
  return labels;
}

describe("AgentCard badges", () => {
  it("shows complete and runnable badges for B4", () => {
    const agent: Agent = {
      id: "fastapi-builder",
      code: "B4",
      title: "FastAPI Builder",
      name: "fastapi-builder",
      description: "test",
      slashCommand: "/fastapi-builder",
      skillPath: "",
      category: "basic",
      path: "",
      agentFile: "",
      role: "",
      objective: "",
      tasks: [],
      rules: [],
      deliverables: [],
      invocation: [],
      type: "runnable",
      status: "complete",
      runnable: { stack: "Python", testSummary: "pytest 5/5" },
    };
    assert.deepEqual(badgeLabels(agent), ["Complete", "Runnable", "pytest 5/5"]);
  });
});
