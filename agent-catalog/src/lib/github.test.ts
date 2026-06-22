import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { githubBlobUrl } from "@/types/agent";

describe("githubBlobUrl", () => {
  it("builds a GitHub blob URL from a repo path", () => {
    const url = githubBlobUrl(
      "https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma",
      "docs/README.md",
    );
    assert.equal(
      url,
      "https://github.com/Rohitverma9569/AI-Agent-Tasks_Rohit_Verma/blob/main/docs/README.md",
    );
  });
});
