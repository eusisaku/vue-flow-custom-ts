import {
  type NodeType,
  type WorkflowNodeData
} from '../types'

/**
 * Creates a default data object for a given node type.
 * This ensures the returned object is correctly typed for the discriminated union.
 *
 * @param type The specific type of the node to create.
 * @param onEdit The callback function to handle node editing.
 * @returns A valid WorkflowNodeData object with default values.
 */
export function createNodeData(type: NodeType, onEdit: (nodeId: string) => void): WorkflowNodeData {
  const baseData = {
    label: `New ${type.replace(/-/g, ' ')} Node`,
    subtitle: `A new ${type} node`,
    runStatus: 'idle' as const,
    onEdit,
  }

  // Use a switch statement to satisfy TypeScript's discriminated union checking.
  switch (type) {
    case 'command':
      return { ...baseData, nodeType: 'command', commands: [{ text: 'echo "hello"' }] }
    case 'trigger':
      return { ...baseData, nodeType: 'trigger', triggerType: 'manual' }
    case 'api-call':
      return { ...baseData, nodeType: 'api-call', method: 'GET', url: 'https://api.example.com' }
    case 'condition':
      return { ...baseData, nodeType: 'condition', leftOperand: '{{variable}}', operator: '==', rightOperand: '"value"' }
    case 'notification':
      return { ...baseData, nodeType: 'notification', channel: 'email', recipients: 'test@example.com' }
    case 'transform':
      return { ...baseData, nodeType: 'transform', script: 'return data;' }
    case 'loop':
      return { ...baseData, nodeType: 'loop', arrayVar: 'items' }
    case 'sub-workflow':
      return { ...baseData, nodeType: 'sub-workflow', workflowId: 'wf-id-...' }
    case 'approval':
      return { ...baseData, nodeType: 'approval', approvers: 'admins' }
    case 'delay':
      return { ...baseData, nodeType: 'delay', duration: 5, unit: 'minutes' }
    case 'variable':
      return { ...baseData, nodeType: 'variable', varName: 'myVar', varValue: '"hello"', scope: 'local' }
    default:
      return { ...baseData, nodeType: 'command', commands: [{ text: 'echo "hello"' }] }
  }
}