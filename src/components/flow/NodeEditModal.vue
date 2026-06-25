<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header__left">
              <div class="modal-icon" :class="'modal-icon--' + form.nodeType">
                <template v-if="form.nodeType === 'command'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                </template>
                <template v-else-if="form.nodeType === 'function'">
                  <span class="mi-fn">ƒ</span>
                </template>
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
              <div class="type-tabs">
                <button class="type-tab" :class="{ 'type-tab--active type-tab--cmd': form.nodeType === 'command' }" @click="form.nodeType = 'command'">
                  <span class="tab-icon">&gt;_</span> COMMAND
                </button>
                <button class="type-tab" :class="{ 'type-tab--active type-tab--fn': form.nodeType === 'function' }" @click="form.nodeType = 'function'">
                  <span class="tab-icon tab-icon--fn">ƒ</span> FUNCTION
                </button>
              </div>
            </div>

            <!-- Label -->
            <div class="form-group">
              <label class="form-label">Node Label</label>
              <input v-model="form.label" class="form-input" placeholder="e.g. 1. Kumpulkan metrik host" />
            </div>

            <!-- Subtitle -->
            <div class="form-group">
              <label class="form-label">Subtitle / Description</label>
              <input v-model="form.subtitle" class="form-input" placeholder="e.g. 5 command(s)" />
            </div>

            <!-- Condition Label -->
            <div class="form-group">
              <label class="form-label">
                Condition Label
                <span class="form-label__hint">(optional — e.g. IF: DISK_HIGH == FALSE)</span>
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
            <div v-if="form.nodeType === 'function'" class="form-group">
              <label class="form-label">Function Name / Params</label>
              <input v-model="form.params" class="form-input cmd-input" placeholder="e.g. getProduct" />
            </div>
            <div v-if="form.nodeType === 'function'" class="form-group">
              <label class="form-label">Bound</label>
              <input v-model="form.bound" class="form-input cmd-input" placeholder="e.g. 1 BOUND" />
            </div>
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
  conditionLabel: '',
  conditionType: '',
  commands: [],
  params: '',
  bound: '1 BOUND'
})

function loadForm(): void {
  const d = props.nodeData
  form.value = {
    nodeType: d?.nodeType ?? 'command',
    label: d?.label ?? '',
    subtitle: d?.subtitle ?? '',
    conditionLabel: d?.conditionLabel ?? '',
    conditionType: d?.conditionType ?? '',
    commands: (d?.commands ?? []).map((c: CommandItem) => ({ ...c })),
    params: d?.params ?? '',
    bound: d?.bound ?? '1 BOUND'
  }
}

watch(() => props.modelValue, (val) => {
  if (val) loadForm()
})

function closeModal(): void {
  emit('update:modelValue', false)
}

function addCommand(): void {
  form.value.commands.push({ text: '', tag: '', tagType: '' })
}

function removeCommand(idx: number): void {
  form.value.commands.splice(idx, 1)
}

function saveNode(): void {
  const payload: Partial<WorkflowNodeData> = {
    nodeType: form.value.nodeType,
    label: form.value.label,
    subtitle: form.value.subtitle || (form.value.nodeType === 'command'
      ? `${form.value.commands.length} command(s)`
      : form.value.params),
    conditionLabel: form.value.conditionLabel || undefined,
    conditionType: (form.value.conditionType as 'true' | 'false' | '') || undefined,
    commands: form.value.commands.filter(c => c.text),
    params: form.value.params,
    bound: form.value.bound
  }
  emit('save', { nodeId: props.nodeId ?? '', data: payload })
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
.mi-fn { font-size: 22px; font-style: italic; }
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

.type-tabs { display: flex; gap: 6px; }
.type-tab {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 12px; border-radius: 8px; border: 1px solid #1e2d3d;
  background: #080e17; font-size: 11px; font-weight: 700;
  letter-spacing: 0.07em; color: #4a5568; cursor: pointer; transition: all 0.2s;
}
.type-tab:hover { border-color: #2d4060; color: #94a3b8; }
.type-tab--active { border-color: transparent; }
.type-tab--cmd.type-tab--active { background: #0a3340; color: #00e5c0; border-color: #00e5c040; }
.type-tab--fn.type-tab--active { background: #2d1a4a; color: #a78bfa; border-color: #a78bfa40; }
.tab-icon { font-family: var(--font-mono); font-weight: 900; }
.tab-icon--fn { font-style: italic; font-size: 15px; }

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
