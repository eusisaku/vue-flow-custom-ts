<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <div v-for="toast in toasts" :key="toast.id" class="toast-item" :class="'toast--' + toast.type">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else-if="toast.type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="toast-msg">{{ toast.message }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ToastMessage, ToastType } from '../../types'

const toasts = ref<ToastMessage[]>([])

function show(message: string, type: ToastType = 'success', duration = 3000): void {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

// Expose untuk digunakan via template ref
defineExpose({ show })
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(13, 21, 33, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #1e2d3d;
  padding: 12px 18px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  pointer-events: all;
  min-width: 250px;
}

.toast--success { border-color: #00e5a040; }
.toast--success .toast-icon { color: #00e5a0; }
.toast--error { border-color: #ff4d4d40; }
.toast--error .toast-icon { color: #ff4d4d; }
.toast--info { border-color: #38bdf840; }
.toast--info .toast-icon { color: #38bdf8; }

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
</style>
