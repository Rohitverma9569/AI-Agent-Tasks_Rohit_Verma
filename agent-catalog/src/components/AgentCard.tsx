import type { Agent, Category } from "@/types/agent";
import { CopyButton } from "./CopyButton";

type Props = {
  agent: Agent;
  category?: Category;
  onSelect: (agent: Agent) => void;
};

export function AgentCard({ agent, category, onSelect }: Props) {
  const accent = category?.accent ?? "#10b981";

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(agent);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(agent)}
      onKeyDown={handleKeyDown}
      className="group flex h-full w-full cursor-pointer flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 text-left shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-zinc-600 hover:bg-zinc-900 hover:shadow-emerald-500/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      style={{ borderTopColor: accent, borderTopWidth: 3 }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold text-zinc-950"
            style={{ backgroundColor: accent }}
          >
            {agent.code}
          </span>
          <code className="truncate text-sm font-medium text-emerald-400">{agent.slashCommand}</code>
        </div>
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <CopyButton text={agent.slashCommand.split(" ")[0]} />
        </div>
      </div>

      <h3 className="text-lg font-semibold leading-snug text-zinc-100 group-hover:text-white">
        {agent.title}
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
        {agent.description}
      </p>

      <p className="mt-4 text-xs font-medium text-zinc-600 transition group-hover:text-emerald-500/80">
        Click for details →
      </p>
    </div>
  );
}
