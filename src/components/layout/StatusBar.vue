<template>
  <div class="status-bar">
    <div class="status-left">
      <div class="status-item">
        <span class="status-dot" :class="statusDotClass"></span>
        <span class="status-label">Status:</span>
        <span class="status-val text-white" :class="statusTextClass">{{ catalogStatus }}</span>
      </div>
      <div class="status-item">
        <span class="status-dot status-dot--cyan"></span>
        <span class="status-label">Cluster:</span>
        <span class="status-val text-white">cluster-jkt-01</span>
      </div>
      <div class="status-item">
        <span class="status-dot status-dot--amber"></span>
        <span class="status-label">Queue Lag:</span>
        <span class="status-val text-white">1.2s</span>
      </div>
    </div>

    <div class="status-right">
      <span class="status-label">Uptime:</span>
      <span class="status-val text-white" style="margin-right: 12px">99.98%</span>
      <span class="status-val text-white mono">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { WorkflowStatus } from '../../types'

const props = withDefaults(defineProps<{ catalogStatus?: WorkflowStatus }>(), {
  catalogStatus: 'OFF'
})

function getFormattedTime(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}.${pad(d.getMinutes())}.${pad(d.getSeconds())} WIB`
}

const currentTime = ref(getFormattedTime())
let interval: ReturnType<typeof setInterval> | null = null

const statusDotClass = computed<string>(() => {
  if (props.catalogStatus === 'AUTO') return 'status-dot--green'
  if (props.catalogStatus === 'REQ') return 'status-dot--amber'
  if (props.catalogStatus === 'LIVE') return 'status-dot--cyan'
  return 'status-dot--gray'
})

const statusTextClass = computed<string>(() => {
  if (props.catalogStatus === 'AUTO') return 'text-green'
  if (props.catalogStatus === 'REQ') return 'text-amber'
  if (props.catalogStatus === 'LIVE') return 'text-cyan'
  return 'text-gray'
})

onMounted(() => {
  interval = setInterval(() => { currentTime.value = getFormattedTime() }, 1000)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.status-bar {
  display: flex; align-items: center; justify-content: space-between;
  height: 28px; background: rgba(5, 15, 30, 0.96);
  border-bottom: 1px solid var(--border, #1e2d3d);
  padding: 0 16px; font-size: 10px;
  font-family: var(--font-mono, monospace); flex-shrink: 0;
}
.status-left, .status-right { display: flex; align-items: center; gap: 16px; }
.status-item { display: flex; align-items: center; gap: 6px; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-dot--green { background: #10b981; }
.status-dot--cyan { background: #06b6d4; }
.status-dot--amber { background: #f59e0b; }
.status-dot--gray { background: #64748b; }
.status-label { color: #64748b; }
.status-val { font-weight: 600; }
.text-white { color: #e2e8f0; }
.text-green { color: #10b981; }
.text-cyan { color: #06b6d4; }
.text-amber { color: #f59e0b; }
.text-gray { color: #94a3b8; }
.mono { font-family: var(--font-mono, monospace); }
</style>
