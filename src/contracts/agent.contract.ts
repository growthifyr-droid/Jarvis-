/**
 * Phase 1: Foundation Contract for Future Agent Registry
 *
 * This contract establishes the pluggable architecture for Phase 2+ agent modules.
 * Agents in future phases (e.g., Code Intelligence, Security Auditor, Task Automator)
 * will implement this contract without requiring rewrites to the core desktop shell.
 */

export interface AgentCapability {
  name: string;
  description: string;
  requiresPermission: boolean;
}

export interface AgentPermission {
  scope: string; // e.g. 'fs:read', 'network:egress', 'ipc:system'
  reason: string;
  granted: boolean;
}

export interface AgentDefinition {
  /** Unique immutable identifier for the agent (e.g. 'agent.core.supervisor') */
  id: string;

  /** Human-readable display name */
  name: string;

  /** Functional description of the agent's role */
  description: string;

  /** List of capability descriptors this agent can execute */
  capabilities: AgentCapability[];

  /** Granular security permissions required by the agent */
  permissions: AgentPermission[];

  /** Runtime state: enabled / disabled by user or supervisor */
  enabled: boolean;

  /** Isolated memory namespace partition for future SQLite/Vector storage */
  memoryNamespace: string;

  /** Semantic versioning of the agent plugin */
  version: string;

  /** Custom metadata and execution flags */
  metadata?: Record<string, unknown>;
}

/**
 * Interface for Future Agent Registry Manager
 */
export interface IAgentRegistry {
  registerAgent(agent: AgentDefinition): void;
  unregisterAgent(agentId: string): void;
  getAgent(agentId: string): AgentDefinition | undefined;
  listAgents(): AgentDefinition[];
  enableAgent(agentId: string): void;
  disableAgent(agentId: string): void;
}
