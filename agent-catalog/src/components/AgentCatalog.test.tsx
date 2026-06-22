import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Agent } from "@/types/agent";

function filterAgents(agents: Agent[], category: string): Agent[] {
  return agents.filter((agent) => {
    if (category === "all") return true;
    if (category === "runnable") return agent.type === "runnable";
    return agent.category === category;
  });
}

describe("AgentCatalog filters", () => {
  const agents: Agent[] = [
    {
      id: "a",
      code: "B4",
      title: "A",
      name: "a",
      description: "",
      slashCommand: "/a",
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
    },
    {
      id: "b",
      code: "B1",
      title: "B",
      name: "b",
      description: "",
      slashCommand: "/b",
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
      type: "report",
      status: "complete",
    },
  ];

  it("filters runnable agents", () => {
    assert.equal(filterAgents(agents, "runnable").length, 1);
    assert.equal(filterAgents(agents, "runnable")[0].code, "B4");
  });
});
