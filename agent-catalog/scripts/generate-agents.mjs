import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const CATEGORIES = [
  {
    id: "basic",
    label: "Basic",
    subtitle: "Repo Reader & Builder",
    dir: "Basic-repo-reader-and-builder",
    accent: "#3b82f6",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    subtitle: "Polyglot Builder",
    dir: "Intermediate-repo operator and polyglot builder",
    accent: "#10b981",
  },
  {
    id: "advanced",
    label: "Advanced",
    subtitle: "Parallel Agent Operator",
    dir: "Advanced-parallel agent operator and system builder",
    accent: "#8b5cf6",
  },
  {
    id: "devops",
    label: "DevOps",
    subtitle: "Infra & Platform",
    dir: "Infra-and-DevOps",
    accent: "#f59e0b",
  },
];

function extractSection(body, heading) {
  const regex = new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n## |\\n### [A-Z]|$)`);
  const match = body.match(regex);
  return match?.[1]?.trim() ?? "";
}

function extractBullets(section) {
  if (!section) return [];
  return section
    .split("\n")
    .filter((line) => /^[\*\-]\s/.test(line))
    .map((line) => line.replace(/^[\*\-]\s+/, "").trim())
    .filter(Boolean);
}

function extractDeliverables(section) {
  if (!section) return [];
  const rows = [];
  for (const line of section.split("\n")) {
    const m = line.match(/^\|\s*`?([^`|]+?)`?\s*\|\s*(.+?)\s*\|/);
    if (!m || m[1].includes("---") || m[1] === "Path") continue;
    rows.push({ path: m[1].trim(), purpose: m[2].trim() });
  }
  return rows;
}

function extractInvocation(section) {
  if (!section) return [];
  const blocks = section.match(/```[\s\S]*?```/g) ?? [];
  return blocks
    .map((b) => b.replace(/```/g, "").trim())
    .filter(Boolean);
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { name: "", description: "" };

  const fm = match[1];
  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const descBlock = fm.match(/description:\s*>-\s*\n([\s\S]*?)(?=\n\w|$)/);
  const description = descBlock
    ? descBlock[1].replace(/\n\s+/g, " ").trim()
    : (fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "");

  return { name, description };
}

function parseAgentMd(filePath, category, folderName) {
  const raw = fs.readFileSync(filePath, "utf8");
  const body = raw.replace(/^---[\s\S]*?---\n/, "");
  const { name, description } = parseFrontmatter(raw);

  const slashMatch = body.match(/\*\*Slash command:\*\*\s*`([^`]+)`/);
  const slashCommand = slashMatch?.[1] ?? (name ? `/${name}` : "");

  const skillMatch = body.match(/\*\*Slash registration:\*\*\s*`([^`]+)`/);
  const skillPath = skillMatch?.[1] ?? "";

  const title =
    body.match(/^# (.+)/m)?.[1]?.replace(/\s*Agent\s*$/i, "").trim() ??
    folderName.replace(/_/g, " ");

  const roleSection = extractSection(body, "Role");
  const role = roleSection.replace(/\n+/g, " ").trim();

  const objective =
    extractSection(body, "Objective").replace(/\n+/g, " ").trim() ||
    extractSection(body, "Tasks").split("\n")[0]?.trim() ||
    "";

  const tasks = extractBullets(extractSection(body, "Tasks"));
  const rules = extractBullets(extractSection(body, "Rules"));
  const deliverables = extractDeliverables(extractSection(body, "Deliverables"));

  const invocationSection =
    extractSection(body, "Invocation") ||
    extractSection(body, "Invocation examples");
  const invocation = extractInvocation(invocationSection);

  const code = folderName.match(/^([A-Z]\d+)/)?.[1] ?? "";
  const relPath = path.relative(repoRoot, path.dirname(filePath));

  return {
    id: name || folderName,
    code,
    title,
    name,
    description,
    slashCommand,
    skillPath,
    category,
    path: relPath,
    agentFile: path.relative(repoRoot, filePath),
    role,
    objective,
    tasks,
    rules,
    deliverables,
    invocation,
  };
}

function findAgentMdFiles(categoryDir) {
  const full = path.join(repoRoot, categoryDir);
  if (!fs.existsSync(full)) return [];

  return fs
    .readdirSync(full, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(full, d.name, "agent.md"))
    .filter((f) => fs.existsSync(f));
}

const agents = CATEGORIES.flatMap(({ id, dir }) =>
  findAgentMdFiles(dir).map((f) =>
    parseAgentMd(f, id, path.basename(path.dirname(f))),
  ),
).sort((a, b) => a.code.localeCompare(b.code));

const outDir = path.join(__dirname, "../src/data");
const outFile = path.join(outDir, "agents.json");
fs.mkdirSync(outDir, { recursive: true });

if (agents.length === 0 && fs.existsSync(outFile)) {
  const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
  if (existing.agents?.length > 0) {
    console.warn(
      `No agent.md files found outside agent-catalog; keeping ${existing.agents.length} agents in agents.json`,
    );
    process.exit(0);
  }
}

fs.writeFileSync(
  outFile,
  JSON.stringify(
    { categories: CATEGORIES, agents, generatedAt: new Date().toISOString() },
    null,
    2,
  ),
);

console.log(`Generated ${agents.length} agents → src/data/agents.json`);
