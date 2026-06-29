import type { PaletteNode } from '../types'

/**
 * Daftar semua tipe node yang tersedia untuk ditampilkan di NodePalette.
 */
export const AVAILABLE_NODES: PaletteNode[] = [
  // Core Nodes
  { type: 'command', label: 'Command', category: 'Core', icon: '>_' },
  { type: 'variable', label: 'Variable', category: 'Core', icon: '𝑥' },
  { type: 'delay', label: 'Delay / Wait', category: 'Core', icon: '⏱' },

  // Logic & Flow Control
  { type: 'condition', label: 'Condition (If)', category: 'Advanced', icon: '?' },
  { type: 'loop', label: 'Loop', category: 'Advanced', icon: '↻' },
  { type: 'approval', label: 'Approval', category: 'Advanced', icon: '✓' },
  { type: 'transform', label: 'Transform Data', category: 'Advanced', icon: '{ }' },
  { type: 'sub-workflow', label: 'Sub-Workflow', category: 'Advanced', icon: '⎘' },

  // Integration Nodes
  { type: 'trigger', label: 'Trigger', category: 'Integration', icon: '⚡' },
  { type: 'api-call', label: 'API Call', category: 'Integration', icon: '⇄' },
  { type: 'notification', label: 'Notification', category: 'Integration', icon: '🔔' },

  // Deprecated/Legacy (jika masih ingin ditampilkan)
  // { type: 'function', label: 'Function (Legacy)', category: 'Custom', icon: 'ƒ' },
  // { type: 'decision', label: 'Decision (Legacy)', category: 'Custom', icon: '⟨/⟩' },
]