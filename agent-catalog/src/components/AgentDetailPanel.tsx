"use client";

import { useEffect } from "react";
import type { Agent, Category } from "@/types/agent";
import { githubBlobUrl } from "@/types/agent";
import { CopyButton } from "./CopyButton";

type Props = {
  agent: Agent;
  category?: Category;
  githubRepo?: string;
  onClose: () => void;
};

const DOC_LABELS: Record<string, string> = {
  readme: "README",
  status: "STATUS",
  localTesting: "local-testing",
  validationResults: "validation-results",
};

export function AgentDetailPanel({ agent, category, githubRepo, onClose }: Props) {
  const accent = category?.accent ?? "#10b981";

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const docEntries = agent.docs
    ? Object.entries(agent.docs).filter(([, path]) => Boolean(path))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-detail-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:rounded-2xl"
        style={{ borderTopColor: accent, borderTopWidth: 4 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-md px-2 py-0.5 font-mono text-xs font-bold text-zinc-950"
                style={{ backgroundColor: accent }}
              >
                {agent.code}
              </span>
              {category ? (
                <span className="text-xs font-medium text-zinc-500">{category.label}</span>
              ) : null}
              {agent.status === "complete" ? (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                  Complete
                </span>
              ) : null}
              {agent.type === "runnable" ? (
                <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-400">
                  Runnable
                </span>
              ) : null}
            </div>
            <h2 id="agent-detail-title" className="text-2xl font-bold text-zinc-100">
              {agent.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-emerald-400">
                {agent.slashCommand}
              </code>
              <CopyButton text={agent.slashCommand.split(" ")[0]} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {agent.runnable ? (
            <Section title="Runnable demo">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Stack</dt>
                  <dd className="mt-1 text-zinc-300">{agent.runnable.stack}</dd>
                </div>
                {agent.runnable.testSummary ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Tests</dt>
                    <dd className="mt-1 text-zinc-300">{agent.runnable.testSummary}</dd>
                  </div>
                ) : null}
                {agent.runnable.verifiedAt ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Verified</dt>
                    <dd className="mt-1 text-zinc-300">{agent.runnable.verifiedAt}</dd>
                  </div>
                ) : null}
                {agent.runnable.port ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Port</dt>
                    <dd className="mt-1 font-mono text-zinc-300">{agent.runnable.port}</dd>
                  </div>
                ) : null}
                {agent.runnable.ports ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Ports</dt>
                    <dd className="mt-1 font-mono text-zinc-300">{agent.runnable.ports.join(", ")}</dd>
                  </div>
                ) : null}
                {agent.runnable.cliHint ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">CLI</dt>
                    <dd className="mt-1 font-mono text-xs text-zinc-300">{agent.runnable.cliHint}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                {agent.runnable.localUrl ? (
                  <a
                    href={agent.runnable.localUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:border-emerald-500/40"
                  >
                    Local Swagger / API
                  </a>
                ) : null}
                {agent.runnable.engineUrl ? (
                  <a
                    href={agent.runnable.engineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:border-emerald-500/40"
                  >
                    Rust engine health
                  </a>
                ) : null}
              </div>
            </Section>
          ) : null}

          {docEntries.length > 0 && githubRepo ? (
            <Section title="Project docs">
              <ul className="flex flex-wrap gap-2">
                {docEntries.map(([key, relPath]) => (
                  <li key={key}>
                    <a
                      href={githubBlobUrl(githubRepo, relPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-emerald-400"
                    >
                      {DOC_LABELS[key] ?? key}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <Section title="Description">
            <p className="text-sm leading-relaxed text-zinc-300">{agent.description}</p>
          </Section>

          {agent.role ? (
            <Section title="Role">
              <p className="text-sm leading-relaxed text-zinc-400">{agent.role}</p>
            </Section>
          ) : null}

          {agent.objective ? (
            <Section title="Objective">
              <p className="text-sm leading-relaxed text-zinc-400">{agent.objective}</p>
            </Section>
          ) : null}

          {agent.tasks.length > 0 ? (
            <Section title="Tasks">
              <ul className="list-inside list-disc space-y-1.5 text-sm text-zinc-400">
                {agent.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {agent.deliverables.length > 0 ? (
            <Section title="Deliverables">
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Path</th>
                      <th className="px-4 py-2.5 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {agent.deliverables.map((d) => (
                      <tr key={d.path} className="bg-zinc-900/40">
                        <td className="px-4 py-2.5 font-mono text-xs text-emerald-400/90">{d.path}</td>
                        <td className="px-4 py-2.5 text-zinc-400">{d.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          ) : null}

          {agent.rules.length > 0 ? (
            <Section title="Rules">
              <ul className="space-y-2">
                {agent.rules.map((rule) => (
                  <li
                    key={rule}
                    className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400"
                  >
                    {rule}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {agent.invocation.length > 0 ? (
            <Section title="How to invoke">
              {agent.invocation.map((cmd) => (
                <pre
                  key={cmd}
                  className="mb-2 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-zinc-300"
                >
                  {cmd}
                </pre>
              ))}
            </Section>
          ) : null}

          <Section title="Source">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Agent file</dt>
                <dd className="mt-1 font-mono text-xs text-zinc-400">
                  {githubRepo ? (
                    <a
                      href={githubBlobUrl(githubRepo, agent.agentFile)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400/90 hover:underline"
                    >
                      {agent.agentFile}
                    </a>
                  ) : (
                    agent.agentFile
                  )}
                </dd>
              </div>
              {agent.skillPath ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Skill registration</dt>
                  <dd className="mt-1 font-mono text-xs text-zinc-400">{agent.skillPath}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Project path</dt>
                <dd className="mt-1 font-mono text-xs text-zinc-400">{agent.path}</dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</h3>
      {children}
    </section>
  );
}
