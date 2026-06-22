import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Agent, AgentsData } from "./agent";

describe("Agent types", () => {
  it("accepts extended agent metadata", () => {
    const agent: Agent = {
      id: "fastapi-builder",
      code: "B4",
      title: "FastAPI Builder",
      name: "fastapi-builder",
      description: "test",
      slashCommand: "/fastapi-builder",
      skillPath: ".cursor/skills/fastapi-builder/SKILL.md",
      category: "basic",
      path: "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service",
      agentFile: "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/agent.md",
      role: "",
      objective: "",
      tasks: [],
      rules: [],
      deliverables: [],
      invocation: [],
      type: "runnable",
      status: "complete",
      docs: { readme: "README.md", localTesting: "local-testing.md" },
      runnable: {
        stack: "Python · FastAPI",
        testSummary: "pytest 5/5",
        verifiedAt: "2026-06-22",
        localUrl: "http://127.0.0.1:8001/docs",
      },
    };
    assert.equal(agent.type, "runnable");
    assert.equal(agent.runnable?.testSummary, "pytest 5/5");
  });

  it("accepts catalog meta", () => {
    const data: AgentsData = {
      categories: [],
      agents: [],
      generatedAt: new Date().toISOString(),
      meta: {
        totalAgents: 24,
        completedAgents: 24,
        runnableProjects: 5,
        githubRepo:
          "https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma",
        docsHub: "docs/README.md",
      },
    };
    assert.equal(data.meta?.completedAgents, 24);
  });
});
