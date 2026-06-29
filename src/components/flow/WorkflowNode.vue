<template>
  <div class="wf-node-wrapper" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Condition badge on top (command/function/decision) -->
    <div
      v-if="hasConditionLabel"
      class="condition-badge"
      :class="conditionBadgeClass"
    >
      {{ conditionLabel }}
    </div>

    <!-- Trigger: entry-point marker -->
    <div v-if="data.nodeType === 'trigger'" class="entry-badge">
      ⚡ ENTRY
    </div>

    <div class="wf-node" :class="nodeClasses">
      <!-- Edit button (hover) -->
      <Transition name="fade-btn">
        <button v-if="isHovered" class="wf-edit-btn" @click.stop="handleEdit" title="Edit node">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
      </Transition>

      <!-- Node Header -->
      <div class="wf-node__header wf-node__header--clickable" @click.stop="toggleExpand">
        <!-- Icon -->
        <div class="wf-node__icon" :class="'wf-icon--' + data.nodeType">
          <!-- Existing types -->
          <span v-if="data.nodeType === 'command'" class="icon-terminal">&gt;_</span>
          <span v-else-if="data.nodeType === 'function'" class="icon-fn">ƒ</span>
          <span v-else-if="data.nodeType === 'decision'" class="icon-decision">⟨/⟩</span>
          <!-- Phase 1 types -->
          <span v-else-if="data.nodeType === 'trigger'" class="icon-trigger">⚡</span>
          <span v-else-if="data.nodeType === 'api-call'" class="icon-api">⇄</span>
          <span v-else-if="data.nodeType === 'condition'" class="icon-condition">?</span>
          <span v-else-if="data.nodeType === 'notification'" class="icon-notification">🔔</span>
          <!-- Phase 2 types -->
          <span v-else-if="data.nodeType === 'transform'" class="icon-transform">{ }</span>
          <span v-else-if="data.nodeType === 'loop'" class="icon-loop">↻</span>
          <span v-else-if="data.nodeType === 'sub-workflow'" class="icon-sub-workflow">⎘</span>
          <span v-else-if="data.nodeType === 'approval'" class="icon-approval">✓</span>
          <span v-else-if="data.nodeType === 'delay'" class="icon-delay">⏱</span>
          <span v-else-if="data.nodeType === 'variable'" class="icon-variable">𝑥</span>
          <span v-else class="icon-default">●</span>
        </div>

        <div class="wf-node__meta">
          <span class="wf-node__type-badge" :class="'badge--' + data.nodeType">
            {{ nodeTypeBadgeLabel }}
          </span>
          <div class="wf-node__title">{{ data.label }}</div>
          <div class="wf-node__subtitle">{{ data.subtitle }}</div>
        </div>

        <!-- Expand/Collapse -->
        <button
          class="wf-expand-btn"
          :class="{ 'wf-expand-btn--expanded': isExpanded }"
          :title="isExpanded ? 'Collapse' : 'Expand'"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <!-- Collapsible Body -->
      <div class="wf-node__body" :class="{ 'wf-node__body--expanded': isExpanded, 'wf-node__body--collapsed': !isExpanded }">

        <!-- COMMAND: list of shell commands -->
        <div v-if="data.nodeType === 'command' && commandData.commands?.length" class="wf-node__commands">
          <div v-for="(cmd, idx) in commandData.commands" :key="idx" class="wf-cmd-item">
            <span class="wf-cmd-index">{{ idx + 1 }}.</span>
            <span class="wf-cmd-text">{{ cmd.text }}</span>
            <span v-if="cmd.tag" class="wf-cmd-tag" :class="'tag--' + cmd.tagType">{{ cmd.tag }}</span>
          </div>
        </div>

        <!-- FUNCTION: params -->
        <div v-else-if="data.nodeType === 'function'" class="wf-node__params">
          <div class="wf-params-row">
            <span class="wf-params-label">PARAMS:</span>
            <span class="wf-params-bound">{{ functionData.bound || '1 BOUND' }}</span>
          </div>
          <div class="wf-params-value">{{ functionData.params || 'getProduct' }}</div>
        </div>

        <!-- TRIGGER: trigger type + details -->
        <div v-else-if="data.nodeType === 'trigger'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">TYPE</span>
            <span class="wf-info-value wf-info-chip wf-info-chip--amber">{{ triggerData.triggerType?.toUpperCase() }}</span>
          </div>
          <div v-if="triggerData.cronExpr" class="wf-info-row">
            <span class="wf-info-label">CRON</span>
            <span class="wf-info-value wf-info-mono">{{ triggerData.cronExpr }}</span>
          </div>
          <div v-if="triggerData.endpoint" class="wf-info-row">
            <span class="wf-info-label">ENDPOINT</span>
            <span class="wf-info-value wf-info-mono wf-info-truncate">{{ triggerData.endpoint }}</span>
          </div>
          <div v-if="triggerData.eventName" class="wf-info-row">
            <span class="wf-info-label">EVENT</span>
            <span class="wf-info-value">{{ triggerData.eventName }}</span>
          </div>
        </div>

        <!-- API CALL: method + url -->
        <div v-else-if="data.nodeType === 'api-call'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-value wf-method-badge" :class="'method--' + apiData.method?.toLowerCase()">
              {{ apiData.method }}
            </span>
            <span class="wf-info-value wf-info-mono wf-info-truncate">{{ apiData.url || 'https://...' }}</span>
          </div>
          <div v-if="apiData.outputVar" class="wf-info-row">
            <span class="wf-info-label">STORE</span>
            <span class="wf-info-value wf-info-mono">{{ storeVariableDisplay }}</span>
          </div>
        </div>

        <!-- CONDITION: expression preview -->
        <div v-else-if="data.nodeType === 'condition'" class="wf-node__info-block">
          <div class="wf-condition-expr">
            <span class="wf-expr-part">{{ conditionData.leftOperand || '...' }}</span>
            <span class="wf-expr-op">{{ conditionData.operator || '==' }}</span>
            <span class="wf-expr-part">{{ conditionData.rightOperand || '...' }}</span>
          </div>
        </div>

        <!-- NOTIFICATION: channel + recipients -->
        <div v-else-if="data.nodeType === 'notification'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">CHANNEL</span>
            <span class="wf-info-value wf-info-chip wf-info-chip--purple">{{ notifData.channel?.toUpperCase() }}</span>
          </div>
          <div v-if="notifData.recipients" class="wf-info-row">
            <span class="wf-info-label">TO</span>
            <span class="wf-info-value wf-info-truncate">{{ notifData.recipients }}</span>
          </div>
          <div v-if="notifData.template" class="wf-info-row wf-info-row--template">
            <span class="wf-info-template">{{ notifData.template }}</span>
          </div>
        </div>

        <!-- TRANSFORM: script preview -->
        <div v-else-if="data.nodeType === 'transform'" class="wf-node__info-block">
          <div class="wf-info-row wf-info-row--template">
            <span class="wf-info-template wf-info-mono">{{ transformData.script || 'return data;' }}</span>
          </div>
        </div>

        <!-- LOOP: Array var + iteration -->
        <div v-else-if="data.nodeType === 'loop'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">OVER</span>
            <span class="wf-info-value wf-info-mono">{{ loopData.arrayVar || 'items' }}</span>
          </div>
          <div v-if="loopData.maxIterations" class="wf-info-row">
            <span class="wf-info-label">MAX</span>
            <span class="wf-info-value">{{ loopData.maxIterations }}</span>
          </div>
        </div>

        <!-- SUB-WORKFLOW: ID -->
        <div v-else-if="data.nodeType === 'sub-workflow'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">ID</span>
            <span class="wf-info-value wf-info-mono">{{ subWorkflowData.workflowId || 'none' }}</span>
          </div>
        </div>

        <!-- APPROVAL: Approvers + timeout -->
        <div v-else-if="data.nodeType === 'approval'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">WHO</span>
            <span class="wf-info-value wf-info-truncate">{{ approvalData.approvers || 'admin' }}</span>
          </div>
          <div v-if="approvalData.timeoutHours" class="wf-info-row">
            <span class="wf-info-label">WAIT</span>
            <span class="wf-info-value">{{ approvalData.timeoutHours }}h</span>
          </div>
        </div>

        <!-- DELAY: Duration + unit -->
        <div v-else-if="data.nodeType === 'delay'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">WAIT</span>
            <span class="wf-info-value">{{ delayData.duration || 0 }} {{ delayData.unit || 'seconds' }}</span>
          </div>
        </div>

        <!-- VARIABLE: Scope + name/val -->
        <div v-else-if="data.nodeType === 'variable'" class="wf-node__info-block">
          <div class="wf-info-row">
            <span class="wf-info-label">SCOPE</span>
            <span class="wf-info-value wf-info-chip wf-info-chip--amber">{{ variableData.scope?.toUpperCase() || 'LOCAL' }}</span>
          </div>
          <div class="wf-info-row">
            <span class="wf-info-label">SET</span>
            <span class="wf-info-value wf-info-mono">{{ variableData.varName || 'var' }} = {{ variableData.varValue || 'val' }}</span>
          </div>
        </div>

      </div><!-- /body -->

      <!-- Phase 3: Execution Output Panel (dipindah ke luar body agar selalu terlihat) -->
      <div v-if="data.runStatus && data.runStatus !== 'idle'" class="wf-node__exec-output">
        <div class="exec-header" :class="'exec-header--' + data.runStatus" @click.stop="toggleLogs">
          <span class="exec-status">
            <span class="exec-indicator"></span>
            {{ data.runStatus.toUpperCase() }}
            <span v-if="data.runDuration != null" class="exec-duration">({{ data.runDuration }}ms)</span>
          </span>
          <span class="exec-toggle">{{ showLogs ? '▼' : '▶' }}</span>
        </div>
        <div v-if="showLogs" class="exec-logs">
          <div v-if="data.errorMessage" class="exec-log-error">{{ data.errorMessage }}</div>
          <div v-for="(log, i) in data.runOutput" :key="i" class="exec-log-line">{{ log }}</div>
          <div v-if="!data.errorMessage && (!data.runOutput || data.runOutput.length === 0)" class="exec-log-empty">No logs available</div>
        </div>
      </div>

      <!-- Action Footer — handles selalu di DOM. Diberi border-top jika panel eksekusi tidak ada -->
      <div class="wf-node__actions">
        <!-- Trigger: hanya output (no input handle) -->
        <template v-if="data.nodeType === 'trigger'">
          <div class="wf-action wf-action--always">
            <Handle type="source" :position="Position.Bottom" id="always" class="action-handle action-handle--always" />
            <span class="action-dot action-dot--always"></span>
            Next
          </div>
        </template>

        <!-- Condition: true / false outputs -->
        <template v-else-if="data.nodeType === 'condition'">
          <div class="wf-action wf-action--true">
            <Handle type="source" :position="Position.Bottom" id="condition-true" class="action-handle action-handle--true" />
            <span class="action-dot action-dot--success"></span>
            True
          </div>
          <div class="wf-action wf-action--false">
            <Handle type="source" :position="Position.Bottom" id="condition-false" class="action-handle action-handle--false" />
            <span class="action-dot action-dot--failure"></span>
            False
          </div>
        </template>

        <!-- Loop: item / done outputs -->
        <template v-else-if="data.nodeType === 'loop'">
          <div class="wf-action wf-action--true">
            <Handle type="source" :position="Position.Bottom" id="loop-item" class="action-handle action-handle--true" />
            <span class="action-dot action-dot--success"></span>
            Item
          </div>
          <div class="wf-action wf-action--always">
            <Handle type="source" :position="Position.Bottom" id="loop-done" class="action-handle action-handle--always" />
            <span class="action-dot action-dot--always"></span>
            Done
          </div>
        </template>

        <!-- Approval: approved / rejected / timeout outputs -->
        <template v-else-if="data.nodeType === 'approval'">
          <div class="wf-action wf-action--true">
            <Handle type="source" :position="Position.Bottom" id="approved" class="action-handle action-handle--true" />
            <span class="action-dot action-dot--success"></span>
            Approved
          </div>
          <div class="wf-action wf-action--false">
            <Handle type="source" :position="Position.Bottom" id="rejected" class="action-handle action-handle--false" />
            <span class="action-dot action-dot--failure"></span>
            Rejected
          </div>
          <div class="wf-action wf-action--reset">
            <Handle type="source" :position="Position.Bottom" id="timeout" class="action-handle action-handle--reset" />
            Timeout
          </div>
        </template>

        <!-- Default: success / reset / failure -->
        <template v-else>
          <div class="wf-action wf-action--success">
            <Handle type="source" :position="Position.Bottom" id="success" class="action-handle action-handle--success" />
            <span class="action-dot action-dot--success"></span>
            Success
          </div>
          <div class="wf-action wf-action--reset">
            <Handle type="source" :position="Position.Bottom" id="reset" class="action-handle action-handle--reset" />
            Reset
          </div>
          <div class="wf-action wf-action--failure">
            <Handle type="source" :position="Position.Bottom" id="failure" class="action-handle action-handle--failure" />
            Failure
            <span class="action-dot action-dot--failure"></span>
          </div>
        </template>
      </div>

      <!-- Edge Handles (target) — trigger tidak punya input -->
      <template v-if="data.nodeType !== 'trigger'">
        <Handle type="target" :position="Position.Top" id="top" class="wf-handle wf-handle--top" />
        <Handle type="target" :position="Position.Left" id="left" class="wf-handle wf-handle--left" />
      </template>
      <Handle type="source" :position="Position.Right" id="right" class="wf-handle wf-handle--right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import type {
  WorkflowNodeData,
  CommandNodeData,
  FunctionNodeData,
  TriggerNodeData,
  ApiCallNodeData,
  ConditionNodeData,
  NotificationNodeData,
} from '../../types'
import type {
  TransformNodeData,
  LoopNodeData,
  SubWorkflowNodeData,
  ApprovalNodeData,
  DelayNodeData,
  VariableNodeData,
} from '../../types/node-types'

interface Props {
  id: string
  data: WorkflowNodeData
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const { updateNodeInternals } = useVueFlow()

const isHovered = ref(false)
const isExpanded = ref(false)
const showLogs = ref(false)
let animFrameId: number | null = null
let resizeObserver: ResizeObserver | null = null
const el = ref<HTMLElement | null>(null)

// ─── Typed data accessors (discriminated union narrowing) ─────────────────────
const commandData = computed(() => props.data as CommandNodeData)
const functionData = computed(() => props.data as FunctionNodeData)
const triggerData = computed(() => props.data as TriggerNodeData)
const apiData = computed(() => props.data as ApiCallNodeData)
const conditionData = computed(() => props.data as ConditionNodeData)
const notifData = computed(() => props.data as NotificationNodeData)
const transformData = computed(() => props.data as TransformNodeData)
const loopData = computed(() => props.data as LoopNodeData)
const subWorkflowData = computed(() => props.data as SubWorkflowNodeData)
const approvalData = computed(() => props.data as ApprovalNodeData)
const delayData = computed(() => props.data as DelayNodeData)
const variableData = computed(() => props.data as VariableNodeData)

const storeVariableDisplay = computed(() => `{{${apiData.value.outputVar}}}`)

// ─── Condition badge (command / function / decision) ─────────────────────────
const hasConditionLabel = computed(() => {
  const d = props.data as CommandNodeData | FunctionNodeData
  return 'conditionLabel' in d && !!d.conditionLabel
})
const conditionLabel = computed(() => {
  const d = props.data as CommandNodeData
  return d.conditionLabel ?? ''
})
const conditionBadgeClass = computed(() => {
  const d = props.data as CommandNodeData
  return d.conditionType === 'true' ? 'condition-true' : 'condition-false'
})

// ─── Node classes ─────────────────────────────────────────────────────────────
const nodeClasses = computed(() => [
  'wf-node--' + props.data.nodeType,
  { 
    'wf-node--selected': props.selected, 
    'wf-node--collapsed': !isExpanded.value,
    'wf-node--status-running': props.data.runStatus === 'running',
    'wf-node--status-success': props.data.runStatus === 'success',
    'wf-node--status-error': props.data.runStatus === 'error',
    'wf-node--status-skipped': props.data.runStatus === 'skipped',
  }
])

watch(() => props.data.runStatus, (newStatus, oldStatus) => {
  // Otomatis buka log dan expand node jika terjadi error
  if (newStatus === 'error') {
    isExpanded.value = true;
    showLogs.value = true;
  }
  // Otomatis buka log saat eksekusi selesai (pertama kali)
  if ((newStatus === 'success' || newStatus === 'error') && oldStatus === 'running') {
    showLogs.value = true
  }
  updateNodeInternals([props.id]);
})

// ─── Badge label ──────────────────────────────────────────────────────────────
const NODE_BADGE_LABELS: Record<string, string> = {
  'command': 'CMD',
  'function': 'FN',
  'decision': 'IF/ELSE',
  'trigger': 'TRIGGER',
  'api-call': 'API',
  'condition': 'CONDITION',
  'notification': 'NOTIFY',
  'transform': 'TRANSFORM',
  'loop': 'LOOP',
  'sub-workflow': 'SUB-WF',
  'approval': 'APPROVAL',
  'delay': 'DELAY',
  'variable': 'VAR',
}
const nodeTypeBadgeLabel = computed(() => NODE_BADGE_LABELS[props.data.nodeType] ?? props.data.nodeType.toUpperCase())

// ─── Actions ──────────────────────────────────────────────────────────────────
function handleEdit(): void {
  if (typeof props.data.onEdit === 'function') {
    props.data.onEdit(props.id)
  }
}

function toggleExpand(): void {
  isExpanded.value = !isExpanded.value
  // Vue Flow perlu diberitahu untuk menghitung ulang dimensi node
  updateNodeInternals([props.id]);
}

function toggleLogs(): void {
  showLogs.value = !showLogs.value
  // Vue Flow perlu diberitahu untuk menghitung ulang dimensi node
  updateNodeInternals([props.id]);
}

onMounted(() => {
  const rootEl = document.getElementById(props.id);
  if (rootEl) {
    resizeObserver = new ResizeObserver(() => updateNodeInternals([props.id]));
    resizeObserver.observe(rootEl);
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
/* ─── Wrapper ─────────────────────────────────────────────────────────────── */
.wf-node-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ─── Entry / Condition badge ─────────────────────────────────────────────── */
.condition-badge, .entry-badge {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
  z-index: 5;
}
.condition-true { background: #1a3a2a; color: #00e5a0; border: 1px solid #00e5a0; }
.condition-false { background: #3a1a1a; color: #ff4d4d; border: 1px solid #ff4d4d; }
.entry-badge { background: #2a2000; color: #fbbf24; border: 1px solid #fbbf24; }

/* ─── Edit button ─────────────────────────────────────────────────────────── */
.wf-edit-btn {
  position: absolute;
  top: -12px; right: 10px;
  display: inline-flex; align-items: center; gap: 4px;
  background: #0d1521; border: 1px solid #00e5a040; color: #00e5a0;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
  padding: 4px 9px; border-radius: 6px; cursor: pointer; z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4); transition: all 0.2s;
}
.wf-edit-btn:hover { background: #00e5a0; color: #080e17; border-color: #00e5a0; }
.fade-btn-enter-active, .fade-btn-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-btn-enter-from, .fade-btn-leave-to { opacity: 0; transform: translateY(4px); }

/* ─── Node base ───────────────────────────────────────────────────────────── */
.wf-node {
  background: #111827; border: 1.5px solid #1e2d3d;
  border-radius: 12px; min-width: 265px; max-width: 305px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  transition: all 0.25s ease; overflow: visible; position: relative; cursor: pointer;
}
.wf-node:hover { border-color: #00e5a060; box-shadow: 0 8px 40px rgba(0,229,160,0.12); transform: translateY(-2px); }
.wf-node--selected { border-color: #00b8ff !important; box-shadow: 0 0 0 2px rgba(0,184,255,0.25), 0 8px 32px rgba(0,0,0,0.5) !important; }

/* Per-type border accents */
.wf-node--trigger { border-color: #fbbf2440; }
.wf-node--trigger:hover { border-color: #fbbf24; box-shadow: 0 8px 40px rgba(251,191,36,0.15); }
.wf-node--api-call { border-color: #38bdf840; }
.wf-node--api-call:hover { border-color: #38bdf8; box-shadow: 0 8px 40px rgba(56,189,248,0.15); }
.wf-node--condition { border-color: #a78bfa40; }
.wf-node--condition:hover { border-color: #a78bfa; box-shadow: 0 8px 40px rgba(167,139,250,0.15); }
.wf-node--notification { border-color: #f472b640; }
.wf-node--notification:hover { border-color: #f472b6; box-shadow: 0 8px 40px rgba(244,114,182,0.15); }

/* Phase 2 border accents */
.wf-node--transform { border-color: #fca5a540; }
.wf-node--transform:hover { border-color: #fca5a5; box-shadow: 0 8px 40px rgba(252,165,165,0.15); }
.wf-node--loop { border-color: #6ee7b740; }
.wf-node--loop:hover { border-color: #6ee7b7; box-shadow: 0 8px 40px rgba(110,231,183,0.15); }
.wf-node--sub-workflow { border-color: #c4b5fd40; }
.wf-node--sub-workflow:hover { border-color: #c4b5fd; box-shadow: 0 8px 40px rgba(196,181,253,0.15); }
.wf-node--approval { border-color: #fdba7440; }
.wf-node--approval:hover { border-color: #fdba74; box-shadow: 0 8px 40px rgba(253,186,116,0.15); }
.wf-node--delay { border-color: #93c5fd40; }
.wf-node--delay:hover { border-color: #93c5fd; box-shadow: 0 8px 40px rgba(147,197,253,0.15); }
.wf-node--variable { border-color: #fcd34d40; }
.wf-node--variable:hover { border-color: #fcd34d; box-shadow: 0 8px 40px rgba(252,211,77,0.15); }

/* Phase 3: Execution Status Accents */
.wf-node--status-running {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 2px rgba(56,189,248,0.4), 0 0 15px rgba(56,189,248,0.6) !important;
  animation: pulse-ring 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
.wf-node--status-success {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 4px 20px rgba(16,185,129,0.15) !important;
}
.wf-node--status-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239,68,68,0.4), 0 4px 20px rgba(239,68,68,0.2) !important;
}
.wf-node--status-skipped {
  opacity: 0.6;
  border-style: dashed !important;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(56,189,248, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(56,189,248, 0); }
  100% { box-shadow: 0 0 0 0 rgba(56,189,248, 0); }
}

/* Execution Output Panel */
.wf-node__exec-output {
  margin-top: 4px;
  background: #0d1521;
  border-top: 1px solid #1e2d3d;
  font-family: var(--font-mono);
  font-size: 10px;
  border-bottom-left-radius: 11px; border-bottom-right-radius: 11px;
}
.exec-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 6px 12px; cursor: pointer; user-select: none;
  font-weight: 700; color: #94a3b8;
}
.exec-header:hover { background: #111827; }
.exec-header--running { color: #38bdf8; }
.exec-header--success { color: #10b981; }
.exec-header--error { color: #ef4444; }
.exec-status { display: flex; align-items: center; gap: 6px; }
.exec-indicator { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.exec-duration { color: #64748b; font-weight: normal; }
.exec-toggle { font-size: 8px; color: #4a5568; }
.exec-logs {
  padding: 8px 12px; background: #050a12;
  border-top: 1px dashed #1e2d3d;
  max-height: 150px; overflow-y: auto;
}
.exec-log-line { color: #00e5a0; margin-bottom: 2px; }
.exec-log-error { color: #ef4444; margin-bottom: 4px; }
.exec-log-empty { color: #4a5568; font-style: italic; }

/* ─── Header ──────────────────────────────────────────────────────────────── */
.wf-node__header {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 14px 10px; border-bottom: 1px solid #1e2d3d;
  overflow: hidden; transition: border-color 0.25s;
}
.wf-node__header--clickable { cursor: pointer; user-select: none; align-items: center; }
.wf-node__header--clickable:hover { background: rgba(0,229,160,0.03); }
/* Sembunyikan border header jika body diciutkan DAN panel eksekusi tidak ada */
.wf-node--collapsed:not(:has(.wf-node__exec-output)) .wf-node__header { border-bottom-color: transparent; }

/* ─── Expand button ───────────────────────────────────────────────────────── */
.wf-expand-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; min-width: 22px;
  border: 1px solid #1e2d3d; background: #0d1521; border-radius: 6px;
  cursor: pointer; padding: 0; color: #4a5568;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1); flex-shrink: 0; margin-left: auto;
}
.wf-expand-btn svg { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
.wf-expand-btn--expanded svg { transform: rotate(180deg); }
.wf-expand-btn:hover { border-color: #00e5a040; color: #00e5a0; background: rgba(0,229,160,0.08); }

/* ─── Body ────────────────────────────────────────────────────────────────── */
.wf-node__body { overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease; }
.wf-node__body--expanded { max-height: 600px; opacity: 1; }
.wf-node__body--collapsed { max-height: 0; opacity: 0; }

/* ─── Icon ────────────────────────────────────────────────────────────────── */
.wf-node__icon {
  width: 36px; height: 36px; min-width: 36px;
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-weight: 700; flex-shrink: 0;
}
.wf-icon--command   { background: #0a3340; color: #00e5c0; font-size: 12px; font-family: var(--font-mono); }
.wf-icon--function  { background: #2d1a4a; color: #a78bfa; font-size: 20px; }
.wf-icon--decision  { background: #1a2d40; color: #38bdf8; font-size: 12px; }
.wf-icon--trigger   { background: #2a2000; color: #fbbf24; font-size: 16px; }
.wf-icon--api-call  { background: #0a1f40; color: #38bdf8; font-size: 18px; }
.wf-icon--condition { background: #1a1040; color: #a78bfa; font-size: 18px; font-weight: 900; }
.wf-icon--notification { background: #2a0a28; color: #f472b6; font-size: 16px; }
.wf-icon--transform { background: #3a1a2a; color: #fca5a5; font-size: 16px; font-family: var(--font-mono); }
.wf-icon--loop { background: #0a3a2a; color: #6ee7b7; font-size: 18px; }
.wf-icon--sub-workflow { background: #2a1a4a; color: #c4b5fd; font-size: 18px; }
.wf-icon--approval { background: #3a2a0a; color: #fdba74; font-size: 16px; }
.wf-icon--delay { background: #0a2a4a; color: #93c5fd; font-size: 16px; }
.wf-icon--variable { background: #3a3a0a; color: #fcd34d; font-size: 18px; font-style: italic; }

.icon-terminal  { font-family: var(--font-mono); font-size: 11px; font-weight: 900; }
.icon-fn        { font-size: 22px; font-style: italic; }
.icon-trigger   { font-size: 18px; }
.icon-api       { font-size: 20px; }
.icon-condition { font-size: 20px; font-weight: 900; }
.icon-transform { font-size: 16px; font-weight: bold; }
.icon-loop { font-size: 18px; font-weight: bold; }
.icon-sub-workflow { font-size: 18px; }
.icon-approval { font-size: 16px; font-weight: bold; }
.icon-delay { font-size: 18px; }
.icon-variable { font-size: 18px; font-weight: bold; font-family: serif; }

/* ─── Meta ────────────────────────────────────────────────────────────────── */
.wf-node__meta { flex: 1; min-width: 0; }
.wf-node__type-badge {
  display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
  padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;
}
.badge--command      { background: #0a3340; color: #00e5c0; border: 1px solid #00e5c030; }
.badge--function     { background: #2d1a4a; color: #a78bfa; border: 1px solid #a78bfa30; }
.badge--decision     { background: #1a2d40; color: #38bdf8; border: 1px solid #38bdf830; }
.badge--trigger      { background: #2a2000; color: #fbbf24; border: 1px solid #fbbf2430; }
.badge--api-call     { background: #0a1f40; color: #38bdf8; border: 1px solid #38bdf830; }
.badge--condition    { background: #1a1040; color: #a78bfa; border: 1px solid #a78bfa30; }
.badge--notification { background: #2a0a28; color: #f472b6; border: 1px solid #f472b630; }
.badge--transform { background: #3a1a2a; color: #fca5a5; border: 1px solid #fca5a530; }
.badge--loop { background: #0a3a2a; color: #6ee7b7; border: 1px solid #6ee7b730; }
.badge--sub-workflow { background: #2a1a4a; color: #c4b5fd; border: 1px solid #c4b5fd30; }
.badge--approval { background: #3a2a0a; color: #fdba74; border: 1px solid #fdba7430; }
.badge--delay { background: #0a2a4a; color: #93c5fd; border: 1px solid #93c5fd30; }
.badge--variable { background: #3a3a0a; color: #fcd34d; border: 1px solid #fcd34d30; }

.wf-node__title    { font-size: 13px; font-weight: 600; color: #e2e8f0; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wf-node__subtitle { font-size: 11px; color: #4a5568; margin-top: 2px; }

/* ─── Command body ────────────────────────────────────────────────────────── */
.wf-node__commands { padding: 8px 14px; display: flex; flex-direction: column; gap: 4px; background: #0d1521; }
.wf-cmd-item { display: flex; align-items: flex-start; gap: 6px; padding: 5px 8px; background: #111827; border-radius: 6px; border: 1px solid #1e2d3d; }
.wf-cmd-index { font-size: 10px; color: #4a5568; min-width: 14px; flex-shrink: 0; margin-top: 1px; font-family: var(--font-mono); }
.wf-cmd-text  { font-size: 10px; color: #10b981; font-family: var(--font-mono); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.4; }
.wf-cmd-tag   { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; flex-shrink: 0; }
.tag--true  { background: #1a3a2a; color: #00e5a0; }
.tag--false { background: #3a1a1a; color: #ff6b6b; }

/* ─── Function body ───────────────────────────────────────────────────────── */
.wf-node__params { padding: 10px 14px; background: #0d1521; border-top: 1px solid #1e2d3d; }
.wf-params-row   { display: flex; justify-content: space-between; margin-bottom: 6px; }
.wf-params-label { font-size: 9px; color: #4a5568; font-weight: 700; letter-spacing: 0.05em; }
.wf-params-bound { font-size: 9px; color: #4a5568; font-weight: 700; }
.wf-params-value { font-size: 12px; color: #10b981; font-family: var(--font-mono); background: #111827; border: 1px solid #1e2d3d; border-radius: 5px; padding: 5px 8px; }

/* ─── Info block (trigger / api / condition / notification) ───────────────── */
.wf-node__info-block { padding: 10px 14px; background: #0d1521; border-top: 1px solid #1e2d3d; display: flex; flex-direction: column; gap: 6px; }
.wf-info-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.wf-info-row--template { flex-direction: column; align-items: flex-start; }
.wf-info-label { font-size: 9px; color: #4a5568; font-weight: 700; letter-spacing: 0.08em; flex-shrink: 0; min-width: 48px; }
.wf-info-value { font-size: 11px; color: #94a3b8; flex: 1; }
.wf-info-mono  { font-family: var(--font-mono); font-size: 10px; color: #10b981; }
.wf-info-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wf-info-chip  { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; }
.wf-info-chip--amber  { background: #2a2000; color: #fbbf24; border: 1px solid #fbbf2440; }
.wf-info-chip--purple { background: #1a1040; color: #a78bfa; border: 1px solid #a78bfa40; }
.wf-info-chip--pink   { background: #2a0a28; color: #f472b6; border: 1px solid #f472b640; }
.wf-info-template { font-size: 10px; color: #64748b; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }

/* ─── API method badge ────────────────────────────────────────────────────── */
.wf-method-badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; flex-shrink: 0; font-family: var(--font-mono); }
.method--get    { background: #0a3340; color: #00e5a0; }
.method--post   { background: #1a3a2a; color: #4ade80; }
.method--put    { background: #2a2000; color: #fbbf24; }
.method--patch  { background: #1a1040; color: #a78bfa; }
.method--delete { background: #3a1a1a; color: #f87171; }

/* ─── Condition expression ────────────────────────────────────────────────── */
.wf-condition-expr { display: flex; align-items: center; gap: 6px; padding: 6px 0; }
.wf-expr-part { font-family: var(--font-mono); font-size: 11px; color: #10b981; background: #111827; padding: 3px 7px; border-radius: 4px; border: 1px solid #1e2d3d; flex: 1; text-align: center; }
.wf-expr-op   { font-size: 11px; font-weight: 700; color: #a78bfa; flex-shrink: 0; }

/* ─── Action footer ───────────────────────────────────────────────────────── */
.wf-node__actions { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; gap: 6px; }
/* Tambah border-top hanya jika panel eksekusi TIDAK ditampilkan */
.wf-node:not(:has(.wf-node__exec-output)) .wf-node__actions {
  border-top: 1px solid #1e2d3d;
}
.wf-action {
  position: relative; display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500; padding: 5px 10px;
  border-radius: 6px; border: none; cursor: crosshair; transition: all 0.2s;
  background: transparent; color: #64748b;
}
.wf-action--success { color: #00e5a0; border: 1px solid #00e5a030; background: #00e5a010; }
.wf-action--success:hover { background: #00e5a020; }
.wf-action--reset   { color: #64748b; border: 1px solid #1e2d3d; }
.wf-action--reset:hover { color: #94a3b8; border-color: #2d4060; }
.wf-action--failure { color: #ff4d4d; border: 1px solid #ff4d4d30; background: #ff4d4d10; }
.wf-action--failure:hover { background: #ff4d4d20; }
.wf-action--always  { color: #fbbf24; border: 1px solid #fbbf2430; background: #fbbf2410; }
.wf-action--always:hover { background: #fbbf2420; }
.wf-action--true    { color: #00e5a0; border: 1px solid #00e5a030; background: #00e5a010; }
.wf-action--true:hover { background: #00e5a020; }
.wf-action--false   { color: #f87171; border: 1px solid #f8717130; background: #f8717110; }
.wf-action--false:hover { background: #f8717120; }

.action-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.action-dot--success { background: #00e5a0; box-shadow: 0 0 6px #00e5a0; }
.action-dot--failure { background: #ff4d4d; box-shadow: 0 0 6px #ff4d4d; }
.action-dot--always  { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }

.wf-action :deep(.action-handle) {
  opacity: 0 !important; width: 100% !important; height: 100% !important;
  top: 0 !important; left: 0 !important; transform: none !important;
  border-radius: 6px !important; cursor: crosshair !important; margin: 0 !important;
}

/* ─── Connection handles ──────────────────────────────────────────────────── */
:deep(.wf-handle) {
  width: 10px !important; height: 10px !important;
  background: #00e5a0 !important; border: 2px solid #111827 !important;
  border-radius: 50% !important; transition: all 0.2s !important; opacity: 0.35;
}
.wf-node-wrapper:hover :deep(.wf-handle) { opacity: 1; }
:deep(.wf-handle:hover) { transform: scale(1.5) !important; box-shadow: 0 0 12px rgba(0,229,160,0.7) !important; background: #00ffb3 !important; }
:deep(.wf-handle--top)   { top: -5px !important; left: 50% !important; transform: translateX(-50%) !important; }
:deep(.wf-handle--top:hover) { transform: translateX(-50%) scale(1.5) !important; }
:deep(.wf-handle--left)  { left: -5px !important; top: 50% !important; transform: translateY(-50%) !important; }
:deep(.wf-handle--left:hover) { transform: translateY(-50%) scale(1.5) !important; }
:deep(.wf-handle--right) { right: -5px !important; top: 50% !important; transform: translateY(-50%) !important; }
:deep(.wf-handle--right:hover) { transform: translateY(-50%) scale(1.5) !important; }
</style>
