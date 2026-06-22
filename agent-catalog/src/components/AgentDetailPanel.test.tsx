import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { githubBlobUrl, type Agent, type AgentDocs } from "@/types/agent";

function docLinks(repo: string, docs?: AgentDocs) {
  if (!docs) return [];
  const entries: { label: string; href: string }[] = [];
  if (docs.readme) entries.push({ label: "README", href: githubBlobUrl(repo, docs.readme) });
  if (docs.status) entries.push({ label: "STATUS", href: githubBlobUrl(repo, docs.status) });
  if (docs.localTesting)
    entries.push({ label: "local-testing", href: githubBlobUrl(repo, docs.localTesting) });
  if (docs.validationResults)
    entries.push({
      label: "validation-results",
      href: githubBlobUrl(repo, docs.validationResults),
    });
  return entries;
}

describe("AgentDetailPanel doc links", () => {
  it("builds GitHub links for project docs", () => {
    const agent: Agent = {
      id: "fastapi-builder",
      code: "B4",
      title: "FastAPI",
      name: "fastapi-builder",
      description: "",
      slashCommand: "/fastapi-builder",
      skillPath: "",
      category: "basic",
      path: "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service",
      agentFile: "",
      role: "",
      objective: "",
      tasks: [],
      rules: [],
      deliverables: [],
      invocation: [],
      type: "runnable",
      status: "complete",
      docs: {
        readme: "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/README.md",
        localTesting:
          "Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/local-testing.md",
      },
    };
    const repo = "https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma";
    const links = docLinks(repo, agent.docs);
    assert.equal(links.length, 2);
    assert.equal(links[0].label, "README");
    assert.match(links[0].href, /B4_FastAPI_greenfield_service\/README\.md$/);
  });
});
