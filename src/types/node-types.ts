/**
 * === NODE TYPE DEFINITIONS — DISCRIMINATED UNION ===
 * Setiap node type memiliki data interface tersendiri yang extends BaseNodeData.
 * TypeScript akan otomatis narrow type saat mengakses field spesifik per type.
 *
 * @module types/node-types
 */

// ─── Base ────────────────────────────────────────────────────────────────────

export type NodeRunStatus = 'idle' | 'running' | 'success' | 'error' | 'skipped'

export interface BaseNodeData {
  nodeType: NodeType
  label: string
  subtitle: string
  description?: string
  expanded?: boolean
  runStatus?: NodeRunStatus      // Phase 3: live execution status
  runOutput?: string[]           // Phase 3: stdout lines
  runDuration?: number           // Phase 3: ms
  errorMessage?: string          // Phase 3: last error
  onEdit?: (nodeId: string) => void
}

// ─── Command Node (existing — terminal) ──────────────────────────────────────

export interface CommandItem {
  text: string
  tag?: string
  tagType?: 'true' | 'false'
}

export interface CommandNodeData extends BaseNodeData {
  nodeType: 'command'
  commands?: CommandItem[]
  conditionLabel?: string
  conditionType?: 'true' | 'false' | ''
}

// ─── Function Node (existing — terminal) ─────────────────────────────────────

export interface FunctionNodeData extends BaseNodeData {
  nodeType: 'function'
  params?: string
  bound?: string
  conditionLabel?: string
  conditionType?: 'true' | 'false' | ''
}

// ─── Decision Node (existing — simple branching) ─────────────────────────────

export interface DecisionNodeData extends BaseNodeData {
  nodeType: 'decision'
  conditionLabel?: string
  conditionType?: 'true' | 'false' | ''
}

// ─── Trigger Node (NEW Phase 1) ──────────────────────────────────────────────

export type TriggerType = 'webhook' | 'schedule' | 'manual' | 'event'

export interface TriggerNodeData extends BaseNodeData {
  nodeType: 'trigger'
  triggerType: TriggerType
  cronExpr?: string        // jika triggerType === 'schedule'
  endpoint?: string        // jika triggerType === 'webhook'
  eventName?: string       // jika triggerType === 'event'
}

// ─── API Call Node (NEW Phase 1) ─────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiCallNodeData extends BaseNodeData {
  nodeType: 'api-call'
  method: HttpMethod
  url: string
  headers?: Record<string, string>
  bodyTemplate?: string    // JSON template, mendukung {{variableName}}
  outputVar?: string       // nama variable untuk menyimpan response
  timeoutMs?: number
}

// ─── Condition Node (NEW Phase 1 — upgrade dari decision) ────────────────────

export type ConditionOperator = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'contains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'

export interface ConditionNodeData extends BaseNodeData {
  nodeType: 'condition'
  leftOperand: string      // e.g. "{{response.status}}"
  operator: ConditionOperator
  rightOperand: string     // e.g. "200"
}

// ─── Notification Node (NEW Phase 1) ─────────────────────────────────────────

export type NotificationChannel = 'email' | 'slack' | 'webhook' | 'teams' | 'telegram'

export interface NotificationNodeData extends BaseNodeData {
  nodeType: 'notification'
  channel: NotificationChannel
  recipients?: string      // comma-separated emails / channel ID
  template?: string        // pesan, mendukung {{variableName}}
  webhookUrl?: string      // jika channel === 'webhook'
}

// ─── Transform Node (Phase 2) ────────────────────────────────────────────────

export interface TransformNodeData extends BaseNodeData {
  nodeType: 'transform'
  script?: string           // Script to transform payload (e.g. JS or JSONata)
}

// ─── Loop Node (Phase 2) ─────────────────────────────────────────────────────

export interface LoopNodeData extends BaseNodeData {
  nodeType: 'loop'
  arrayVar: string          // Which variable to iterate over (e.g. users)
  maxIterations?: number    // Infinite loop guard
}

// ─── Sub-Workflow Node (Phase 2) ──────────────────────────────────────────────

export interface SubWorkflowNodeData extends BaseNodeData {
  nodeType: 'sub-workflow'
  workflowId: string        // ID of the target workflow to run
}

// ─── Approval Node (Phase 2) ─────────────────────────────────────────────────

export interface ApprovalNodeData extends BaseNodeData {
  nodeType: 'approval'
  approvers: string         // Comma-separated users or roles
  timeoutHours?: number     // Optional timeout in hours
}

// ─── Delay Node (Phase 2) ────────────────────────────────────────────────────

export interface DelayNodeData extends BaseNodeData {
  nodeType: 'delay'
  duration: number
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
}

// ─── Variable Node (Phase 2) ─────────────────────────────────────────────────

export interface VariableNodeData extends BaseNodeData {
  nodeType: 'variable'
  varName: string
  varValue: string
  scope: 'local' | 'global' // local to workflow or global cross-workflow
}

// ─── Union Type ───────────────────────────────────────────────────────────────

export type NodeType =
  | 'command'
  | 'function'
  | 'decision'
  | 'trigger'
  | 'api-call'
  | 'condition'
  | 'notification'
  | 'transform'
  | 'loop'
  | 'sub-workflow'
  | 'approval'
  | 'delay'
  | 'variable'

export type WorkflowNodeData =
  | CommandNodeData
  | FunctionNodeData
  | DecisionNodeData
  | TriggerNodeData
  | ApiCallNodeData
  | ConditionNodeData
  | NotificationNodeData
  | TransformNodeData
  | LoopNodeData
  | SubWorkflowNodeData
  | ApprovalNodeData
  | DelayNodeData
  | VariableNodeData

// ─── Edge Types ───────────────────────────────────────────────────────────────

export type EdgeType =
  | 'success'
  | 'failure'
  | 'reset'
  | 'condition-true'
  | 'condition-false'
  | 'always'

// ─── Type Guards ─────────────────────────────────────────────────────────────

export function isTriggerNode(data: WorkflowNodeData): data is TriggerNodeData {
  return data.nodeType === 'trigger'
}

export function isApiCallNode(data: WorkflowNodeData): data is ApiCallNodeData {
  return data.nodeType === 'api-call'
}

export function isConditionNode(data: WorkflowNodeData): data is ConditionNodeData {
  return data.nodeType === 'condition'
}

export function isNotificationNode(data: WorkflowNodeData): data is NotificationNodeData {
  return data.nodeType === 'notification'
}

export function isCommandNode(data: WorkflowNodeData): data is CommandNodeData {
  return data.nodeType === 'command'
}

export function isFunctionNode(data: WorkflowNodeData): data is FunctionNodeData {
  return data.nodeType === 'function'
}
export function isTransformNode(data: WorkflowNodeData): data is TransformNodeData {
  return data.nodeType === 'transform'
}

export function isLoopNode(data: WorkflowNodeData): data is LoopNodeData {
  return data.nodeType === 'loop'
}

export function isSubWorkflowNode(data: WorkflowNodeData): data is SubWorkflowNodeData {
  return data.nodeType === 'sub-workflow'
}

export function isApprovalNode(data: WorkflowNodeData): data is ApprovalNodeData {
  return data.nodeType === 'approval'
}

export function isDelayNode(data: WorkflowNodeData): data is DelayNodeData {
  return data.nodeType === 'delay'
}

export function isVariableNode(data: WorkflowNodeData): data is VariableNodeData {
  return data.nodeType === 'variable'
}
