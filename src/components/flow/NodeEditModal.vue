<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header__left">
              <div class="modal-icon" :class="'modal-icon--' + form.nodeType">
                <!-- Icons for each type -->
                <template v-if="form.nodeType === 'command'"><span class="mi-icon">&gt;_</span></template>
                <template v-else-if="form.nodeType === 'function'"><span class="mi-icon">ƒ</span></template>
                <template v-else-if="form.nodeType === 'decision'"><span class="mi-icon">⟨/⟩</span></template>
                <template v-else-if="form.nodeType === 'trigger'"><span class="mi-icon">⚡</span></template>
                <template v-else-if="form.nodeType === 'api-call'"><span class="mi-icon">⇄</span></template>
                <template v-else-if="form.nodeType === 'condition'"><span class="mi-icon">?</span></template>
                <template v-else-if="form.nodeType === 'notification'"><span class="mi-icon">🔔</span></template>
                <template v-else-if="form.nodeType === 'transform'"><span class="mi-icon">{ }</span></template>
                <template v-else-if="form.nodeType === 'loop'"><span class="mi-icon">↻</span></template>
                <template v-else-if="form.nodeType === 'sub-workflow'"><span class="mi-icon">⎘</span></template>
                <template v-else-if="form.nodeType === 'approval'"><span class="mi-icon">✓</span></template>
                <template v-else-if="form.nodeType === 'delay'"><span class="mi-icon">⏱</span></template>
                <template v-else-if="form.nodeType === 'variable'"><span class="mi-icon">𝑥</span></template>
              </div>
              <div>
                <div class="modal-title">Edit Node</div>
                <div class="modal-subtitle">{{ nodeId }}</div>
              </div>
            </div>
            <button class="modal-close" @click="closeModal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Node Type Toggle -->
            <div class="form-group">
              <label class="form-label">Node Type</label>
              <div class="type-select-wrapper">
                <select v-model="form.nodeType" class="form-select form-input--flex">
                  <option value="command">Command</option>
                  <option value="function">Function</option>
                  <option value="decision">Decision</option>
                  <option value="trigger">Trigger</option>
                  <option value="api-call">API Call</option>
                  <option value="condition">Condition</option>
                  <option value="notification">Notification</option>
                  <option value="transform">Transform</option>
                  <option value="loop">Loop</option>
                  <option value="sub-workflow">Sub-Workflow</option>
                  <option value="approval">Approval</option>
                  <option value="delay">Delay</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
            </div>

            <!-- Label -->
            <div class="form-group">
              <label class="form-label">Node Label</label>
              <input v-model="form.label" class="form-input" placeholder="e.g. 1. Process Data" />
            </div>

            <!-- Subtitle -->
            <div class="form-group">
              <label class="form-label">Subtitle</label>
              <input v-model="form.subtitle" class="form-input" placeholder="e.g. description" />
            </div>

            <!-- Condition Label (for Command/Function/Decision) -->
            <div v-if="['command', 'function', 'decision'].includes(form.nodeType)" class="form-group">
              <label class="form-label">
                Condition Label
                <span class="form-label__hint">(optional)</span>
              </label>
              <div class="form-row">
                <input v-model="form.conditionLabel" class="form-input form-input--flex cmd-input" placeholder="IF: DISK_HIGH == FALSE" />
                <select v-model="form.conditionType" class="form-select form-select--sm cmd-input">
                  <option value="">None</option>
                  <option value="true">TRUE</option>
                  <option value="false">FALSE</option>
                </select>
              </div>
            </div>

            <!-- Commands (COMMAND type) -->
            <div v-if="form.nodeType === 'command'" class="form-group">
              <label class="form-label">
                Commands
                <button class="label-action" @click="addCommand">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add
                </button>
              </label>
              <div class="cmd-list">
                <div v-for="(cmd, idx) in form.commands" :key="idx" class="cmd-edit-item">
                  <span class="cmd-num">{{ idx + 1 }}</span>
                  <div class="cmd-edit-fields">
                    <input v-model="cmd.text" class="form-input cmd-input" :placeholder="`Command ${idx + 1}...`" />
                    <div class="cmd-edit-row">
                      <input v-model="cmd.tag" class="form-input cmd-tag-input" placeholder="Tag label (optional)" />
                      <select v-model="cmd.tagType" class="form-select form-select--sm">
                        <option value="">No tag</option>
                        <option value="true">IF TRUE</option>
                        <option value="false">IF ELSE</option>
                      </select>
                    </div>
                  </div>
                  <button class="cmd-remove" @click="removeCommand(idx)" title="Remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div v-if="!form.commands.length" class="cmd-empty">
                  No commands. Click <strong>+ Add</strong> to add one.
                </div>
              </div>
            </div>

            <!-- Function Params -->
            <template v-if="form.nodeType === 'function'">
              <div class="form-group">
                <label class="form-label">Function Name / Params</label>
                <input v-model="form.params" class="form-input cmd-input" placeholder="e.g. getProduct" />
              </div>
              <div class="form-group">
                <label class="form-label">Bound</label>
                <input v-model="form.bound" class="form-input cmd-input" placeholder="e.g. 1 BOUND" />
              </div>
            </template>

            <!-- Trigger Settings -->
            <template v-if="form.nodeType === 'trigger'">
              <div class="form-group">
                <label class="form-label">Trigger Type</label>
                <select v-model="form.triggerType" class="form-select form-input--flex">
                  <option value="webhook">Webhook</option>
                  <option value="schedule">Schedule (Cron)</option>
                  <option value="event">Event</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div v-if="form.triggerType === 'schedule'" class="form-group">
                <label class="form-label">Cron Expression</label>
                <input v-model="form.cronExpr" class="form-input cmd-input" placeholder="* * * * *" />
              </div>
              <div v-if="form.triggerType === 'webhook'" class="form-group">
                <label class="form-label">Endpoint</label>
                <input v-model="form.endpoint" class="form-input cmd-input" placeholder="/api/webhook" />
              </div>
              <div v-if="form.triggerType === 'event'" class="form-group">
                <label class="form-label">Event Name</label>
                <input v-model="form.eventName" class="form-input cmd-input" placeholder="user.created" />
              </div>
            </template>

            <!-- API Call Settings -->
            <template v-if="form.nodeType === 'api-call'">
              <div class="form-group">
                <label class="form-label">Method & URL</label>
                <div class="form-row">
                  <select v-model="form.method" class="form-select form-select--sm">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input v-model="form.url" class="form-input form-input--flex cmd-input" placeholder="https://api.example.com" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Output Variable</label>
                <input v-model="form.outputVar" class="form-input cmd-input" placeholder="response" />
              </div>
            </template>

            <!-- Condition Settings -->
            <template v-if="form.nodeType === 'condition'">
              <div class="form-group">
                <label class="form-label">Expression</label>
                <div class="form-row">
                  <input v-model="form.leftOperand" class="form-input form-input--flex cmd-input" placeholder="{{ status }}" />
                  <select v-model="form.operator" class="form-select form-select--sm">
                    <option value="==">==</option>
                    <option value="!=">!=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value="contains">contains</option>
                  </select>
                  <input v-model="form.rightOperand" class="form-input form-input--flex cmd-input" placeholder="200" />
                </div>
              </div>
            </template>

            <!-- Notification Settings -->
            <template v-if="form.nodeType === 'notification'">
              <div class="form-group">
                <label class="form-label">Channel</label>
                <select v-model="form.channel" class="form-select form-input--flex">
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="webhook">Webhook</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Recipients / Target</label>
                <input v-model="form.recipients" class="form-input" placeholder="#general or email@example.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Message Template</label>
                <textarea v-model="form.template" class="form-input cmd-input" rows="3" placeholder="Hello {{ user }}"></textarea>
              </div>
            </template>

            <!-- Transform Settings -->
            <template v-if="form.nodeType === 'transform'">
              <div class="form-group">
                <label class="form-label">Transformation Script (JS/JSONata)</label>
                <textarea v-model="form.script" class="form-input cmd-input" rows="5" placeholder="return data.filter(x => x.active);"></textarea>
              </div>
            </template>

            <!-- Loop Settings -->
            <template v-if="form.nodeType === 'loop'">
              <div class="form-group">
                <label class="form-label">Array Variable</label>
                <input v-model="form.arrayVar" class="form-input cmd-input" placeholder="e.g. users" />
              </div>
              <div class="form-group">
                <label class="form-label">Max Iterations (Safety Guard)</label>
                <input v-model.number="form.maxIterations" type="number" class="form-input cmd-input" placeholder="100" />
              </div>
            </template>

            <!-- Sub-Workflow Settings -->
            <template v-if="form.nodeType === 'sub-workflow'">
              <div class="form-group">
                <label class="form-label">Target Workflow ID</label>
                <input v-model="form.workflowId" class="form-input cmd-input" placeholder="wf-xyz-123" />
              </div>
            </template>

            <!-- Approval Settings -->
            <template v-if="form.nodeType === 'approval'">
              <div class="form-group">
                <label class="form-label">Approvers (Comma separated)</label>
                <input v-model="form.approvers" class="form-input cmd-input" placeholder="admin, manager" />
              </div>
              <div class="form-group">
                <label class="form-label">Timeout (Hours)</label>
                <input v-model.number="form.timeoutHours" type="number" class="form-input cmd-input" placeholder="48" />
              </div>
            </template>

            <!-- Delay Settings -->
            <template v-if="form.nodeType === 'delay'">
              <div class="form-group">
                <label class="form-label">Wait Duration</label>
                <div class="form-row">
                  <input v-model.number="form.duration" type="number" class="form-input form-input--flex cmd-input" placeholder="10" />
                  <select v-model="form.unit" class="form-select form-select--sm">
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </template>

            <!-- Variable Settings -->
            <template v-if="form.nodeType === 'variable'">
              <div class="form-group">
                <label class="form-label">Variable Details</label>
                <div class="form-row">
                  <input v-model="form.varName" class="form-input form-input--flex cmd-input" placeholder="Variable Name" />
                  <select v-model="form.scope" class="form-select form-select--sm">
                    <option value="local">Local</option>
                    <option value="global">Global</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Value</label>
                <textarea v-model="form.varValue" class="form-input cmd-input" rows="2" placeholder="Value expression"></textarea>
              </div>
            </template>

          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-delete" @click="deleteNode">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
              Delete Node
            </button>
            <button class="btn-save" @click="saveNode">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <ConfirmModal
      v-model="showConfirm"
      title="Hapus Node"
      :message="`Apakah Anda yakin ingin menghapus node '${form.label}'?`"
      type="danger"
      confirm-text="Hapus"
      @confirm="executeDelete"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import type { WorkflowNodeData, NodeEditForm, CommandItem } from '../../types'

interface Props {
  modelValue: boolean
  nodeId?: string
  nodeData?: WorkflowNodeData | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  nodeId: '',
  nodeData: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [payload: { nodeId: string; data: Partial<WorkflowNodeData> }]
  'delete': [nodeId: string]
}>()

const showConfirm = ref(false)
const form = ref<NodeEditForm>({
  nodeType: 'command',
  label: '',
  subtitle: '',
  description: '',
  conditionLabel: '',
  conditionType: '',
  commands: [],
  params: '',
  bound: '1 BOUND',
  triggerType: 'webhook',
  cronExpr: '',
  endpoint: '',
  eventName: '',
  method: 'GET',
  url: '',
  headers: [],
  bodyTemplate: '',
  outputVar: '',
  timeoutMs: 5000,
  leftOperand: '',
  operator: '==',
  rightOperand: '',
  channel: 'slack',
  recipients: '',
  template: '',
  webhookUrl: '',
  script: '',
  arrayVar: '',
  maxIterations: 100,
  workflowId: '',
  approvers: '',
  timeoutHours: 24,
  duration: 1,
  unit: 'minutes',
  varName: '',
  varValue: '',
  scope: 'local'
})

function loadForm(): void {
  const d = props.nodeData as any
  form.value = {
    nodeType: d?.nodeType ?? 'command',
    label: d?.label ?? '',
    subtitle: d?.subtitle ?? '',
    description: d?.description ?? '',
    
    // Command / Function / Decision
    conditionLabel: d?.conditionLabel ?? '',
    conditionType: d?.conditionType ?? '',
    commands: (d?.commands ?? []).map((c: CommandItem) => ({ ...c })),
    params: d?.params ?? '',
    bound: d?.bound ?? '1 BOUND',

    // Trigger
    triggerType: d?.triggerType ?? 'webhook',
    cronExpr: d?.cronExpr ?? '',
    endpoint: d?.endpoint ?? '',
    eventName: d?.eventName ?? '',

    // API Call
    method: d?.method ?? 'GET',
    url: d?.url ?? '',
    headers: d?.headers ?? [],
    bodyTemplate: d?.bodyTemplate ?? '',
    outputVar: d?.outputVar ?? '',
    timeoutMs: d?.timeoutMs ?? 5000,

    // Condition
    leftOperand: d?.leftOperand ?? '',
    operator: d?.operator ?? '==',
    rightOperand: d?.rightOperand ?? '',

    // Notification
    channel: d?.channel ?? 'slack',
    recipients: d?.recipients ?? '',
    template: d?.template ?? '',
    webhookUrl: d?.webhookUrl ?? '',

    // Phase 2
    script: d?.script ?? '',
    arrayVar: d?.arrayVar ?? '',
    maxIterations: d?.maxIterations ?? 100,
    workflowId: d?.workflowId ?? '',
    approvers: d?.approvers ?? '',
    timeoutHours: d?.timeoutHours ?? 24,
    duration: d?.duration ?? 1,
    unit: d?.unit ?? 'minutes',
    varName: d?.varName ?? '',
    varValue: d?.varValue ?? '',
    scope: d?.scope ?? 'local'
  }
}

watch(() => props.modelValue, (val) => {
  if (val) loadForm()
})

function closeModal(): void {
  emit('update:modelValue', false)
}

function addCommand(): void {
  form.value.commands.push({ text: '', tag: '', tagType: 'true' }) // Or no tag
}

function removeCommand(idx: number): void {
  form.value.commands.splice(idx, 1)
}

function saveNode(): void {
  const payload: any = {
    nodeType: form.value.nodeType,
    label: form.value.label,
    subtitle: form.value.subtitle,
    description: form.value.description
  }

  // Populate fields based on type
  if (['command', 'function', 'decision'].includes(form.value.nodeType)) {
    payload.conditionLabel = form.value.conditionLabel || undefined
    payload.conditionType = (form.value.conditionType as 'true' | 'false' | '') || undefined
  }

  if (form.value.nodeType === 'command') {
    payload.commands = form.value.commands.filter((c: CommandItem) => c.text)
    if (!payload.subtitle) payload.subtitle = `${payload.commands.length} command(s)`
  } else if (form.value.nodeType === 'function') {
    payload.params = form.value.params
    payload.bound = form.value.bound
    if (!payload.subtitle) payload.subtitle = form.value.params
  } else if (form.value.nodeType === 'trigger') {
    payload.triggerType = form.value.triggerType
    if (form.value.triggerType === 'schedule') payload.cronExpr = form.value.cronExpr
    if (form.value.triggerType === 'webhook') payload.endpoint = form.value.endpoint
    if (form.value.triggerType === 'event') payload.eventName = form.value.eventName
  } else if (form.value.nodeType === 'api-call') {
    payload.method = form.value.method
    payload.url = form.value.url
    payload.headers = form.value.headers
    payload.bodyTemplate = form.value.bodyTemplate
    payload.outputVar = form.value.outputVar
    payload.timeoutMs = form.value.timeoutMs
  } else if (form.value.nodeType === 'condition') {
    payload.leftOperand = form.value.leftOperand
    payload.operator = form.value.operator
    payload.rightOperand = form.value.rightOperand
  } else if (form.value.nodeType === 'notification') {
    payload.channel = form.value.channel
    payload.recipients = form.value.recipients
    payload.template = form.value.template
    payload.webhookUrl = form.value.webhookUrl
  } else if (form.value.nodeType === 'transform') {
    payload.script = form.value.script
  } else if (form.value.nodeType === 'loop') {
    payload.arrayVar = form.value.arrayVar
    payload.maxIterations = form.value.maxIterations
  } else if (form.value.nodeType === 'sub-workflow') {
    payload.workflowId = form.value.workflowId
  } else if (form.value.nodeType === 'approval') {
    payload.approvers = form.value.approvers
    payload.timeoutHours = form.value.timeoutHours
  } else if (form.value.nodeType === 'delay') {
    payload.duration = form.value.duration
    payload.unit = form.value.unit
  } else if (form.value.nodeType === 'variable') {
    payload.varName = form.value.varName
    payload.varValue = form.value.varValue
    payload.scope = form.value.scope
  }

  emit('save', { nodeId: props.nodeId ?? '', data: payload as Partial<WorkflowNodeData> })
  closeModal()
}

function deleteNode(): void {
  showConfirm.value = true
}

function executeDelete(): void {
  emit('delete', props.nodeId ?? '')
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(5, 10, 20, 0.75); backdrop-filter: blur(6px);
  z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-panel {
  background: #0d1521; border: 1px solid #1e2d3d; border-radius: 16px;
  width: 100%; max-width: 520px; max-height: 90vh; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 229, 160, 0.06);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 16px; border-bottom: 1px solid #1e2d3d;
}
.modal-header__left { display: flex; align-items: center; gap: 12px; }
.modal-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;
}
.modal-icon--command { background: #0a3340; color: #00e5c0; font-size: 13px; font-family: var(--font-mono); }
.modal-icon--function { background: #2d1a4a; color: #a78bfa; font-size: 22px; font-style: italic; }
.modal-icon--decision { background: #1a2d40; color: #38bdf8; font-size: 12px; }
.modal-icon--trigger { background: #2a2000; color: #fbbf24; font-size: 20px; }
.modal-icon--api-call { background: #0a1f40; color: #38bdf8; font-size: 20px; }
.modal-icon--condition { background: #1a1040; color: #a78bfa; font-size: 20px; font-weight: 900; }
.modal-icon--notification { background: #2a0a28; color: #f472b6; font-size: 20px; }
.modal-icon--transform { background: #3a1a2a; color: #fca5a5; font-size: 18px; font-family: var(--font-mono); }
.modal-icon--loop { background: #0a3a2a; color: #6ee7b7; font-size: 20px; }
.modal-icon--sub-workflow { background: #2a1a4a; color: #c4b5fd; font-size: 20px; }
.modal-icon--approval { background: #3a2a0a; color: #fdba74; font-size: 18px; }
.modal-icon--delay { background: #0a2a4a; color: #93c5fd; font-size: 18px; }
.modal-icon--variable { background: #3a3a0a; color: #fcd34d; font-size: 20px; font-style: italic; }

.mi-icon { font-size: 20px; font-weight: 700; }
.modal-title { font-size: 15px; font-weight: 700; color: #e2e8f0; }
.modal-subtitle { font-size: 11px; color: #4a5568; margin-top: 2px; font-family: var(--font-mono); }
.modal-close {
  width: 32px; height: 32px; background: #1e2d3d; border: none; border-radius: 8px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #64748b; transition: all 0.2s; flex-shrink: 0;
}
.modal-close:hover { background: #2d4060; color: #e2e8f0; }

.modal-body {
  flex: 1; overflow-y: auto; padding: 20px;
  display: flex; flex-direction: column; gap: 16px;
  scrollbar-width: thin; scrollbar-color: #1e2d3d transparent;
}
.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 4px; }

.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-label {
  font-size: 11px; font-weight: 700; color: #64748b;
  letter-spacing: 0.07em; text-transform: uppercase;
  display: flex; align-items: center; gap: 8px;
}
.form-label__hint { font-weight: 400; text-transform: none; letter-spacing: 0; color: #334155; }
.label-action {
  margin-left: auto; display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; color: #00e5a0;
  background: #00e5a010; border: 1px solid #00e5a030; border-radius: 5px;
  padding: 3px 8px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.04em;
}
.label-action:hover { background: #00e5a020; }
.form-input {
  width: 100%; background: #080e17; border: 1px solid #1e2d3d;
  border-radius: 8px; padding: 9px 12px; font-size: 13px;
  color: #e2e8f0; outline: none; transition: border-color 0.2s; font-family: inherit;
}
.form-input::placeholder { color: #334155; }
.form-input:focus { border-color: #00e5a060; box-shadow: 0 0 0 3px rgba(0, 229, 160, 0.08); }
.form-input--flex { flex: 1; }
.form-row { display: flex; gap: 8px; align-items: stretch; }
.form-select {
  background: #080e17; border: 1px solid #1e2d3d; border-radius: 8px;
  padding: 9px 10px; font-size: 12px; color: #94a3b8; outline: none;
  cursor: pointer; transition: border-color 0.2s;
}
.form-select:focus { border-color: #00e5a060; }
.form-select--sm { min-width: 110px; }
.type-select-wrapper { display: flex; gap: 6px; }

.cmd-list { display: flex; flex-direction: column; gap: 6px; }
.cmd-empty {
  font-size: 12px; color: #334155; text-align: center; padding: 16px;
  border: 1px dashed #1e2d3d; border-radius: 8px;
}
.cmd-empty strong { color: #00e5a0; }
.cmd-edit-item {
  display: flex; align-items: flex-start; gap: 8px;
  background: #080e17; border: 1px solid #1e2d3d; border-radius: 8px; padding: 10px;
  transition: border-color 0.2s;
}
.cmd-edit-item:hover { border-color: #2d4060; }
.cmd-num { font-size: 10px; color: #4a5568; font-weight: 700; min-width: 16px; margin-top: 10px; font-family: var(--font-mono); }
.cmd-edit-fields { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.cmd-input { font-family: var(--font-mono); font-size: 12px; color: #10b981; }
.cmd-edit-row { display: flex; gap: 6px; }
.cmd-tag-input { flex: 1; font-size: 11px; }
.cmd-remove {
  width: 28px; height: 28px; background: transparent; border: 1px solid #1e2d3d;
  border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #4a5568; transition: all 0.2s; flex-shrink: 0; margin-top: 2px;
}
.cmd-remove:hover { background: #3a1a1a; border-color: #ff4d4d40; color: #ff4d4d; }

.modal-footer { display: flex; align-items: center; gap: 8px; padding: 16px 20px; border-top: 1px solid #1e2d3d; }
.btn-cancel {
  padding: 9px 16px; background: transparent; border: 1px solid #1e2d3d;
  border-radius: 8px; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover { border-color: #2d4060; color: #94a3b8; }
.btn-delete {
  padding: 9px 14px; background: #3a1a1a; border: 1px solid #ff4d4d30;
  border-radius: 8px; font-size: 12px; font-weight: 700; color: #ff4d4d; cursor: pointer;
  transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px;
}
.btn-delete:hover { background: #4a2020; border-color: #ff4d4d60; }
.btn-save {
  margin-left: auto; padding: 9px 18px;
  background: linear-gradient(135deg, #00e5a0, #00b8c8); border: none; border-radius: 8px;
  font-size: 13px; font-weight: 700; color: #080e17; cursor: pointer; transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 16px rgba(0, 229, 160, 0.3);
}
.btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0, 229, 160, 0.4); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-panel, .modal-fade-leave-active .modal-panel {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.modal-fade-enter-from .modal-panel { transform: scale(0.92) translateY(10px); opacity: 0; }
.modal-fade-leave-to .modal-panel { transform: scale(0.96) translateY(5px); opacity: 0; }
</style>
