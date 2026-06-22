import agentsData from "@/data/agents.json";
import { AgentCatalog } from "@/components/AgentCatalog";
import type { AgentsData } from "@/types/agent";
import { githubBlobUrl } from "@/types/agent";

export default function Home() {
  const data = agentsData as AgentsData;
  const meta = data.meta;
  const repo = meta?.githubRepo;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <header className="relative border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-emerald-500">
                Cursor Agent Toolkit
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                PML Agent Catalog
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
                All {data.agents.length} agents across Basic, Intermediate, Advanced, and DevOps
                pipelines — {meta?.completedAgents ?? data.agents.length} / {meta?.totalAgents ?? data.agents.length} complete.
                Copy slash commands, browse evaluation docs, and explore runnable demos.
              </p>
              {repo && meta ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Docs hub", path: meta.docsHub },
                    { label: "Getting started", path: meta.gettingStarted },
                    { label: "Runnable projects", path: meta.runnableProjectsDoc },
                    { label: "Project status", path: meta.projectStatus },
                  ].map((link) => (
                    <a
                      key={link.path}
                      href={githubBlobUrl(repo, link.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-emerald-400"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-sm">
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">Agents</span>
                <span className="font-semibold text-emerald-400">
                  {meta?.completedAgents ?? data.agents.length} / {meta?.totalAgents ?? data.agents.length}
                </span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">Runnable</span>
                <span className="font-semibold text-blue-400">
                  {meta?.runnableProjects ?? data.agents.filter((a) => a.type === "runnable").length}
                </span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-zinc-500">Categories</span>
                <span className="font-semibold text-zinc-200">{data.categories.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <AgentCatalog data={data} />
      </main>

      <footer className="relative border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-600">
        Generated from <code className="text-zinc-500">agent.md</code> + project docs ·{" "}
        {new Date(data.generatedAt).toLocaleDateString()}
        {repo ? (
          <>
            {" "}
            ·{" "}
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-emerald-400"
            >
              GitHub
            </a>
          </>
        ) : null}
      </footer>
    </div>
  );
}
