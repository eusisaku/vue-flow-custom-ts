<template>
  <div class="editor-view app-layout">
    <AppSidebar
      :catalogs="catalogs"
      :active-catalog-id="activeCatalogId"
      @select-catalog="onSelectCatalog"
    />

    <div class="main-area">
      <AppHeader :active-catalog-name="activeCatalog?.name || 'New Workflow'" />
      <StatusBar :catalog-status="workflowStatus" />

      <!-- Editor Toolbar -->
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <button class="btn-action" @click="createNewWorkflow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            New Workflow
          </button>
          <div class="divider-v"></div>

          <!-- Add Node Dropdown -->
          <div class="node-dropdown-wrapper">
            <select class="btn-action node-dropdown" @change="handleAddNodeDropdown">
              <option value="" disabled selected>+ Add Node...</option>
              <optgroup label="System (Phase 0)">
                <option value="command">Terminal Command</option>
                <option value="function">Function</option>
              </optgroup>
              <optgroup label="Integration (Phase 1)">
                <option value="trigger">Trigger</option>
                <option value="api-call">API Call</option>
                <option value="condition">Condition</option>
                <option value="notification">Notification</option>
              </optgroup>
              <optgroup label="Advanced (Phase 2)">
                <option value="transform">Transform</option>
                <option value="loop">Loop</option>
                <option value="sub-workflow">Sub-Workflow</option>
                <option value="approval">Approval</option>
                <option value="delay">Delay</option>
                <option value="variable">Variable</option>
              </optgroup>
            </select>
          </div>

          <div class="divider-v"></div>
          <button class="btn-action" @click="cycleStatus">
            <span class="status-indicator" :class="'status--' + workflowStatus.toLowerCase()"></span>
            Status: {{ workflowStatus }}
          </button>
          <button class="btn-action" @click="cycleRisk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Risk: <span :class="'risk-text risk--' + riskLevel.toLowerCase()">{{ riskLevel }}</span>
          </button>
          <div class="divider-v"></div>
          <button class="btn-action" @click="arrangeGraph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Arrange
          </button>
        </div>

        <div class="toolbar-right">
          <button class="btn-primary" @click="handleSave">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {{ activeCatalogId === 'new' ? 'Save Workflow' : 'Save Changes' }}
          </button>
          <button v-if="activeCatalogId === 'new'" class="btn-action btn-danger" @click="reloadFlow" title="Reset Flow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset
          </button>
          <button class="btn-icon btn-close" @click="emit('close-editor')" title="Close Editor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <main class="page-content">
        <WorkflowChart
          ref="workflowChartRef"
          :catalog="activeCatalog"
          edge-type-prop="success"
        />
      </main>

      <!-- Save Modal -->
      <div v-if="showSaveModal" class="modal-backdrop">
        <div class="modal-content">
          <h2 class="modal-title">Save New Workflow</h2>
          <div class="form-group">
            <label>Workflow Name</label>
            <input type="text" v-model="newWorkflowData.name" placeholder="e.g. Server Backup" class="form-input">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newWorkflowData.description" placeholder="Optional description..." class="form-input" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="showSaveModal = false">Cancel</button>
            <button class="btn-primary" @click="confirmSaveWorkflow">Save Workflow</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import StatusBar from './StatusBar.vue'
import WorkflowChart from '../flow/WorkflowChart.vue'
import { workflowCatalogs } from '../../data/workflowCatalogs'
import type { WorkflowCatalog, WorkflowStatus, RiskLevel, NodeType } from '../../types'

interface Props {
  initialCatalogId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  initialCatalogId: null
})

const emit = defineEmits<{
  'close-editor': []
}>()

// ─── State ───────────────────────────────────────────────────────────────────
const catalogs = ref<WorkflowCatalog[]>(workflowCatalogs)
const activeCatalogId = ref<string>(props.initialCatalogId ?? catalogs.value[0]?.id ?? '')
const workflowStatus = ref<WorkflowStatus>('OFF')
const riskLevel = ref<RiskLevel>('NONE')
const showSaveModal = ref(false)
const newWorkflowData = ref({ name: '', description: '' })
const workflowChartRef = ref<InstanceType<typeof WorkflowChart> | null>(null)

// ─── Computed ────────────────────────────────────────────────────────────────
const activeCatalog = computed<WorkflowCatalog | null>(() => {
  if (activeCatalogId.value === 'new') {
    return {
      id: 'NEW-WF', code: 'NEW-WF', name: 'Untitled Workflow',
      status: 'OFF', statusColor: 'gray', riskLevel: 'NONE',
      description: 'A blank canvas for your new workflow.',
      schedule: 'Manual', steps: 0, nodes: [], edges: []
    }
  }
  return catalogs.value.find(c => c.id === activeCatalogId.value) ?? null
})

// ─── Watchers ────────────────────────────────────────────────────────────────
watch(activeCatalogId, (newId) => {
  if (newId === 'new') {
    workflowStatus.value = 'OFF'
    riskLevel.value = 'NONE'
  } else {
    const cat = catalogs.value.find(c => c.id === newId)
    if (cat) {
      workflowStatus.value = cat.status ?? 'OFF'
      riskLevel.value = cat.riskLevel ?? 'LOW'
    }
  }
}, { immediate: true })

watch(() => props.initialCatalogId, (newId) => {
  if (newId) activeCatalogId.value = newId
})

// ─── Methods ─────────────────────────────────────────────────────────────────
function createNewWorkflow(): void {
  activeCatalogId.value = 'new'
}

function onSelectCatalog(catalog: WorkflowCatalog): void {
  activeCatalogId.value = catalog.id
}

function handleAddNodeDropdown(event: Event): void {
  const target = event.target as HTMLSelectElement
  const val = target.value as NodeType | ''
  target.value = '' // Reset to placeholder

  if (!val || !workflowChartRef.value) return
  workflowChartRef.value.addNewNode(val)
}

function arrangeGraph(): void {
  workflowChartRef.value?.autoArrange()
}

function cycleStatus(): void {
  const statuses: WorkflowStatus[] = ['OFF', 'AUTO', 'REQ', 'LIVE']
  const idx = statuses.indexOf(workflowStatus.value)
  workflowStatus.value = statuses[(idx + 1) % statuses.length]
}

function cycleRisk(): void {
  if (activeCatalogId.value !== 'new') return
  const risks: RiskLevel[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  const idx = risks.indexOf(riskLevel.value)
  riskLevel.value = risks[(idx + 1) % risks.length]
}

function reloadFlow(): void {
  workflowChartRef.value?.resetFlow()
}

function handleSave(): void {
  if (activeCatalogId.value === 'new') {
    showSaveModal.value = true
  } else {
    alert('Changes saved successfully!')
  }
}

function confirmSaveWorkflow(): void {
  if (!newWorkflowData.value.name) return alert('Name is required')
  alert(`Workflow "${newWorkflowData.value.name}" saved!`)
  showSaveModal.value = false
  emit('close-editor')
}
</script>

<style scoped>
.editor-view {
  display: flex; min-height: 100vh; background: #050f1e;
}
.main-area {
  margin-left: var(--sidebar-w, 240px);
  flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh;
}
.page-content { flex: 1; position: relative; display: flex; flex-direction: column; }

.editor-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 24px; background: #08121f;
  border-bottom: 1px solid var(--border, #1e2d3d);
}
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 8px; }

.btn-action {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 10px; font-size: 11px; font-weight: 600; border-radius: 6px;
  background: #0d1521; border: 1px solid #1e2d3d; color: #94a3b8; cursor: pointer;
}
.btn-action:hover { border-color: #2d4a6a; color: #e2e8f0; }
.btn-action svg { width: 12px; height: 12px; }
.btn-cmd { background: #0a3340; color: #00e5c0; border: 1px solid rgba(0, 229, 192, 0.3); }
.btn-cmd:hover { background: #0c3e4d; border-color: rgba(0, 229, 192, 0.5); color: #00e5c0; }
.btn-func { background: #2d1a4a; color: #a78bfa; border: 1px solid rgba(167, 139, 250, 0.3); }
.btn-func:hover { background: #37205a; border-color: rgba(167, 139, 250, 0.5); color: #a78bfa; }
.btn-trigger { background: #2a2000; color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
.btn-trigger:hover { background: #3a2a00; border-color: rgba(251, 191, 36, 0.5); color: #fbbf24; }
.btn-api { background: #0a1f40; color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
.btn-api:hover { background: #0c2a55; border-color: rgba(56, 189, 248, 0.5); color: #38bdf8; }
.btn-condition { background: #1a1040; color: #a78bfa; border: 1px solid rgba(167, 139, 250, 0.3); }
.btn-condition:hover { background: #231555; border-color: rgba(167, 139, 250, 0.5); color: #a78bfa; }
.btn-notif { background: #2a0a28; color: #f472b6; border: 1px solid rgba(244, 114, 182, 0.3); }
.btn-notif:hover { background: #3a0d37; border-color: rgba(244, 114, 182, 0.5); color: #f472b6; }

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  background: #06b6d4; border: none; color: #050f1e;
  padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.btn-primary svg { width: 14px; height: 14px; }
.btn-primary:hover { background: #08c8e8; }

.btn-danger { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
.btn-danger:hover { background: #ef4444; color: white; border-color: #ef4444; }

.btn-icon {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid #1e2d3d; border-radius: 6px;
  color: #94a3b8; cursor: pointer;
}
.btn-icon svg { width: 14px; height: 14px; }
.btn-close { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
.btn-close:hover { background: #ef4444; color: white; border-color: #ef4444; }

.status-indicator { width: 7px; height: 7px; border-radius: 50%; }
.status--auto { background: #06b6d4; box-shadow: 0 0 5px #06b6d4; }
.status--live { background: #10b981; box-shadow: 0 0 5px #10b981; }
.status--req { background: #f59e0b; box-shadow: 0 0 5px #f59e0b; }
.status--off { background: #64748b; box-shadow: 0 0 5px #64748b; }

.risk-text { font-weight: 700; }
.risk--none { color: #94a3b8; }
.risk--low { color: #00e5a0; }
.risk--medium { color: #eab308; }
.risk--high { color: #f97316; }
.risk--critical { color: #ef4444; }

.node-dropdown {
  appearance: none;
  background-color: #06b6d415;
  color: #00e5a0;
  border-color: #00e5a040;
  padding-right: 24px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%2300e5a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
}
.node-dropdown:hover {
  background-color: #06b6d430;
  border-color: #00e5a0;
}
.node-dropdown option, .node-dropdown optgroup {
  background-color: #0d1521;
  color: #e2e8f0;
}

.divider-v { width: 1px; height: 20px; background: #1e2d3d; }

/* Save Modal */
.modal-backdrop {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(5, 15, 30, 0.8); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: #0d1521; border: 1px solid #1e2d3d; border-radius: 8px;
  width: 400px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.modal-title { font-size: 18px; font-weight: 600; color: #e2e8f0; margin-bottom: 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
.form-input {
  width: 100%; padding: 10px 12px;
  background: rgba(5, 15, 30, 0.5); border: 1px solid #1e2d3d; border-radius: 6px;
  color: #e2e8f0; font-size: 13px; font-family: inherit; outline: none;
}
.form-input:focus { border-color: #06b6d4; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-secondary {
  background: transparent; border: 1px solid #1e2d3d; color: #e2e8f0;
  padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;
}
.btn-secondary:hover { background: #1e2d3d; }
</style>
