export interface Category {
  id: string;
  label: string;
  subtitle: string;
  dir: string;
  accent: string;
}

export interface Deliverable {
  path: string;
  purpose: string;
}

export interface AgentDocs {
  readme?: string;
  status?: string;
  localTesting?: string;
  validationResults?: string;
}

export interface RunnableInfo {
  stack: string;
  port?: number;
  ports?: number[];
  localUrl?: string;
  engineUrl?: string;
  cliHint?: string;
  testSummary?: string;
  verifiedAt?: string;
}

export interface Agent {
  id: string;
  code: string;
  title: string;
  name: string;
  description: string;
  slashCommand: string;
  skillPath: string;
  category: string;
  path: string;
  agentFile: string;
  role: string;
  objective: string;
  tasks: string[];
  rules: string[];
  deliverables: Deliverable[];
  invocation: string[];
  type: "runnable" | "report";
  status: "complete" | "partial" | "pending";
  docs?: AgentDocs;
  runnable?: RunnableInfo;
}

export interface CatalogMeta {
  totalAgents: number;
  completedAgents: number;
  runnableProjects: number;
  githubRepo: string;
  docsHub: string;
  gettingStarted: string;
  runnableProjectsDoc: string;
  projectStatus: string;
}

export interface AgentsData {
  meta?: CatalogMeta;
  categories: Category[];
  agents: Agent[];
  generatedAt: string;
}

export function githubBlobUrl(
  repo: string,
  relPath: string,
  branch = "main",
): string {
  return `${repo}/blob/${branch}/${relPath.replace(/\\/g, "/")}`;
}
