<template>
  <header class="app-header">
    <!-- Breadcrumb -->
    <div class="breadcrumb mono">
      <svg style="width:13px;height:13px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
      </svg>
      Operations
      <span class="sep">/</span>
      <span class="current">{{ activeCatalogName }}</span>
    </div>

    <!-- Action Buttons Group -->
    <div class="header-actions">
      <div class="header-icons">
        <button class="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button class="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="badge"></span>
        </button>
        <button class="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ activeCatalogName?: string }>(), {
  activeCatalogName: 'Workflow Editor'
})
</script>

<style scoped>
.app-header {
  height: var(--header-h, 52px);
  background: rgba(5, 15, 30, 0.96);
  border-bottom: 1px solid var(--border, #1e2d3d);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  backdrop-filter: blur(8px);
  z-index: 100;
  flex-shrink: 0;
}
.breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: #4a5568; white-space: nowrap;
  font-family: var(--font-mono, monospace);
}
.sep { color: #4a5568; }
.current { color: #e2e8f0; font-weight: 500; }
.header-actions { display: flex; align-items: center; gap: 16px; }
.header-icons { display: flex; align-items: center; gap: 8px; }
.btn-icon {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(13, 21, 33, 0.6);
  border: 1px solid var(--border, #1e2d3d);
  border-radius: 6px; color: #94a3b8; cursor: pointer; position: relative; transition: all 0.2s;
}
.btn-icon:hover { background: rgba(13, 21, 33, 0.9); color: #e2e8f0; }
.btn-icon svg { width: 14px; height: 14px; }
.badge {
  position: absolute; top: 6px; right: 8px;
  width: 4px; height: 4px; background: #ef4444; border-radius: 50%;
}
</style>
