"use client";

import { useMemo, useState } from "react";
import type { Agent, AgentsData } from "@/types/agent";
import { AgentCard } from "./AgentCard";
import { AgentDetailPanel } from "./AgentDetailPanel";

export function AgentCatalog({ data }: { data: AgentsData }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.agents.filter((agent) => {
      const matchesCategory =
        activeCategory === "all" || agent.category === activeCategory;
      const matchesQuery =
        !q ||
        agent.title.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.slashCommand.toLowerCase().includes(q) ||
        agent.code.toLowerCase().includes(q) ||
        agent.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [data.agents, query, activeCategory]);

  const categoryMap = Object.fromEntries(data.categories.map((c) => [c.id, c]));
  const selectedCategory = selectedAgent
    ? categoryMap[selectedAgent.category]
    : undefined;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search agents, commands, descriptions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <p className="text-sm text-zinc-500">
            Showing <span className="font-semibold text-zinc-300">{filtered.length}</span> of{" "}
            {data.agents.length}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === "all"
                ? "bg-emerald-500 text-zinc-950"
                : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            All
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat.id
                  ? "text-zinc-950"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
              style={
                activeCategory === cat.id ? { backgroundColor: cat.accent } : undefined
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {activeCategory === "all" ? (
          data.categories.map((cat) => {
            const group = filtered.filter((a) => a.category === cat.id);
            if (group.length === 0) return null;
            return (
              <section key={cat.id} className="mb-14">
                <div className="mb-5 flex items-end gap-3">
                  <h2 className="text-2xl font-bold text-zinc-100">{cat.label}</h2>
                  <span className="text-sm text-zinc-500">{cat.subtitle}</span>
                  <span
                    className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold text-zinc-950"
                    style={{ backgroundColor: cat.accent }}
                  >
                    {group.length}
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      category={cat}
                      onSelect={setSelectedAgent}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                category={categoryMap[agent.category]}
                onSelect={setSelectedAgent}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
            <p className="text-lg font-medium text-zinc-400">No agents match your search</p>
            <p className="mt-1 text-sm text-zinc-600">Try a different keyword or category</p>
          </div>
        ) : null}
      </div>

      {selectedAgent ? (
        <AgentDetailPanel
          agent={selectedAgent}
          category={selectedCategory}
          onClose={() => setSelectedAgent(null)}
        />
      ) : null}
    </>
  );
}
