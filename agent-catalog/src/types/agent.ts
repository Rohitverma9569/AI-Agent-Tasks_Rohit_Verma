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
}

export interface AgentsData {
  categories: Category[];
  agents: Agent[];
  generatedAt: string;
}
