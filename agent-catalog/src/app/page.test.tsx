import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { CatalogMeta } from "@/types/agent";

function completionLabel(meta?: CatalogMeta): string {
  if (!meta) return "";
  return `${meta.completedAgents} / ${meta.totalAgents} complete`;
}

describe("Home page meta", () => {
  it("formats completion label", () => {
    assert.equal(
      completionLabel({ totalAgents: 24, completedAgents: 24 } as CatalogMeta),
      "24 / 24 complete",
    );
  });
});
