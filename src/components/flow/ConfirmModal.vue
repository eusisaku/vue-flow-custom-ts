<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="cancel">
        <div class="modal-panel" @click.stop>
          <div class="modal-body">
            <div class="confirm-icon" :class="'icon--' + type">
              <svg v-if="type === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <svg v-else-if="type === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <div class="confirm-content">
              <h3>{{ title }}</h3>
              <p>{{ message }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="wf-btn wf-btn--cancel" @click="cancel">Batal</button>
            <button class="wf-btn" :class="'wf-btn--' + type" @click="confirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ConfirmConfig } from '../../types'

interface Props extends Partial<ConfirmConfig> {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: 'Konfirmasi',
  message: 'Apakah Anda yakin?',
  type: 'warning',
  confirmText: 'Ya'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

function confirm(): void {
  emit('confirm')
  emit('update:modelValue', false)
}

function cancel(): void {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(5, 10, 20, 0.75); backdrop-filter: blur(6px);
  z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-panel {
  background: #0d1521; border: 1px solid #1e2d3d; border-radius: 16px; width: 100%; max-width: 400px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05); overflow: hidden;
}
.modal-body {
  padding: 24px; display: flex; gap: 16px; align-items: flex-start;
}
.confirm-icon {
  width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.icon--danger { background: #ff4d4d20; color: #ff4d4d; border: 1px solid #ff4d4d40; }
.icon--warning { background: #f59e0b20; color: #f59e0b; border: 1px solid #f59e0b40; }
.icon--info { background: #38bdf820; color: #38bdf8; border: 1px solid #38bdf840; }

.confirm-content h3 { margin: 0 0 8px 0; color: #e2e8f0; font-size: 16px; }
.confirm-content p { margin: 0; color: #94a3b8; font-size: 13px; line-height: 1.5; }

.modal-footer {
  padding: 16px 24px; background: #080e17; border-top: 1px solid #1e2d3d;
  display: flex; justify-content: flex-end; gap: 12px;
}
.wf-btn {
  padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: all 0.2s;
}
.wf-btn--cancel { background: #1e2d3d; color: #e2e8f0; }
.wf-btn--cancel:hover { background: #2d4060; }
.wf-btn--danger { background: #ff4d4d; color: #fff; }
.wf-btn--danger:hover { background: #ff3333; box-shadow: 0 0 12px rgba(255,77,77,0.4); }
.wf-btn--warning { background: #f59e0b; color: #fff; }
.wf-btn--warning:hover { background: #fbbf24; box-shadow: 0 0 12px rgba(245,158,11,0.4); }
.wf-btn--info { background: #38bdf8; color: #fff; }
.wf-btn--info:hover { background: #0ea5e9; box-shadow: 0 0 12px rgba(56,189,248,0.4); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-panel, .modal-fade-leave-active .modal-panel { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease; }
.modal-fade-enter-from .modal-panel { transform: scale(0.92) translateY(10px); opacity: 0; }
.modal-fade-leave-to .modal-panel { transform: scale(0.96) translateY(5px); opacity: 0; }
</style>
