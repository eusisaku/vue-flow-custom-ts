/**
 * === TYPE DEFINITIONS ===
 * Semua interface dan type untuk vue-flow-custom-ts
 * 
 * @module types/index
 */

// ─── Workflow Status & Risk ─────────────────────────────────────────────────

export type WorkflowStatus = 'OFF' | 'AUTO' | 'REQ' | 'LIVE'
export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type NodeType = 'command' | 'function' | 'decision'
export type EdgeType = 'success' | 'failure' | 'reset'
export type StatusColor = 'cyan' | 'amber' | 'green' | 'red' | 'gray'

// ─── Node Data ───────────────────────────────────────────────────────────────

export interface CommandItem {
  text: string
  tag?: string
  tagType?: 'true' | 'false'
}

export interface WorkflowNodeData {
  nodeType: NodeType
  label: string
  subtitle: string
  commands?: CommandItem[]
  params?: string
  bound?: string
  conditionLabel?: string
  conditionType?: 'true' | 'false' | ''
  expanded?: boolean
  onEdit?: (nodeId: string) => void
}

// ─── Flow Element ────────────────────────────────────────────────────────────

export interface WorkflowNodeElement {
  id: string
  type: 'workflow'
  position: { x: number; y: number }
  data: WorkflowNodeData
}

export interface WorkflowEdgeData {
  type: EdgeType
  sequence?: number
  label?: string
  labelType?: EdgeType
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

// ─── Toast ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

// ─── Edit Form ───────────────────────────────────────────────────────────────

export interface NodeEditForm {
  nodeType: NodeType
  label: string
  subtitle: string
  conditionLabel: string
  conditionType: 'true' | 'false' | ''
  commands: CommandItem[]
  params: string
  bound: string
}

// ─── App Navigation ──────────────────────────────────────────────────────────

export type AppView = 'catalog' | 'editor'
