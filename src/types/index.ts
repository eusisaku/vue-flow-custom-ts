/**
 * === TYPE DEFINITIONS ===
 * Semua interface dan type untuk vue-flow-custom-ts
 *
 * @module types/index
 */

// ─── Re-export node types (discriminated union) ───────────────────────────────
export type {
  NodeType,
  EdgeType,
  NodeRunStatus,
  BaseNodeData,
  CommandItem,
  CommandNodeData,
  FunctionNodeData,
  DecisionNodeData,
  TriggerNodeData,
  TriggerType,
  ApiCallNodeData,
  HttpMethod,
  ConditionNodeData,
  ConditionOperator,
  NotificationNodeData,
  NotificationChannel,
  WorkflowNodeData,
} from './node-types'

export {
  isTriggerNode,
  isApiCallNode,
  isConditionNode,
  isNotificationNode,
  isCommandNode,
  isFunctionNode,
} from './node-types'

// ─── Workflow Status & Risk ───────────────────────────────────────────────────

export type WorkflowStatus = 'OFF' | 'AUTO' | 'REQ' | 'LIVE'
export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type StatusColor = 'cyan' | 'amber' | 'green' | 'red' | 'gray'

// ─── Edge Data ────────────────────────────────────────────────────────────────

import type { EdgeType } from './node-types'

export interface WorkflowEdgeData {
  type: EdgeType
  sequence?: number
  label?: string
  labelType?: EdgeType
}

// ─── Flow Element ─────────────────────────────────────────────────────────────

import type { WorkflowNodeData } from './node-types'

export interface WorkflowNodeElement {
  id: string
  type: 'workflow'
  position: { x: number; y: number }
  data: WorkflowNodeData
}

export interface WorkflowEdgeElement {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type: 'workflow'
  updatable?: boolean
  data: WorkflowEdgeData
}

export type FlowElement = WorkflowNodeElement | WorkflowEdgeElement

// ─── Catalog ─────────────────────────────────────────────────────────────────

export interface WorkflowCatalog {
  id: string
  code: string
  name: string
  description: string
  schedule: string
  steps: number
  status: WorkflowStatus
  statusColor: StatusColor
  riskLevel: RiskLevel
  approvalReq?: boolean
  nodes: WorkflowNodeElement[]
  edges: WorkflowEdgeElement[]
}

// ─── Modal / Confirm ─────────────────────────────────────────────────────────

export interface ConfirmConfig {
  title: string
  message: string
  type: 'danger' | 'warning' | 'info'
  confirmText: string
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

import type {
  NodeType,
  TriggerType,
  HttpMethod,
  ConditionOperator,
  NotificationChannel,
  CommandItem,
} from './node-types'

export interface NodeEditForm {
  nodeType: NodeType
  label: string
  subtitle: string
  description: string

  // Command / Function / Decision (existing)
  conditionLabel: string
  conditionType: 'true' | 'false' | ''
  commands: CommandItem[]
  params: string
  bound: string

  // Trigger (new)
  triggerType: TriggerType
  cronExpr: string
  endpoint: string
  eventName: string

  // API Call (new)
  method: HttpMethod
  url: string
  headers: { key: string; value: string }[]
  bodyTemplate: string
  outputVar: string
  timeoutMs: number

  // Condition (new)
  leftOperand: string
  operator: ConditionOperator
  rightOperand: string

  // Notification (new)
  channel: NotificationChannel
  recipients: string
  template: string
  webhookUrl: string
}

// ─── App Navigation ───────────────────────────────────────────────────────────

export type AppView = 'catalog' | 'editor'
