<template>
  <div class="catalog-view">
    <div class="catalog-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="logo-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          <div class="logo-text">PushConfig</div>
        </div>
        <div class="logo-sub">WDC AUTOMATION V4</div>
      </div>
      <div class="nav-section">OPERATIONS</div>
      <div class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        Workflow Catalog
      </div>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">AR</div>
          <div class="user-info">
            <div class="user-name">Ahmad Rizky</div>
            <div class="user-role">SUPERADMIN</div>
          </div>
        </div>
        <button class="btn-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    </div>

    <div class="catalog-main">
      <header class="catalog-header">
        <div class="header-breadcrumbs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Operations <span class="sep">/</span> <span class="text-white">Workflow Catalog</span></span>
        </div>

        <div class="header-search-wrap">
          <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="search-input" placeholder="Search devices, workflows, commands...">
          <span class="search-shortcut mono">⌘K</span>
        </div>

        <div class="header-icons">
          <button class="btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></button>
          <button class="btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="badge"></span></button>
          <button class="btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg></button>
        </div>
      </header>

      <StatusBar />

      <main class="catalog-content">
        <div class="page-title-row">
          <div>
            <h1 class="page-title">Workflow Catalog</h1>
            <p class="page-subtitle">// available automation workflows</p>
          </div>
          <div class="title-actions">
            <button class="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              Filter
            </button>
            <button class="btn-primary" @click="emit('open-editor', 'new')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Workflow
            </button>
          </div>
        </div>

        <div class="catalog-grid">
          <div v-for="catalog in catalogs" :key="catalog.id" class="wf-card" @click="emit('open-editor', catalog.id)">
            <div class="card-header">
              <div class="card-icon" :style="{ color: getStatusColor(catalog.status) }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <div class="card-status" :class="`status-${catalog.status.toLowerCase()}`">{{ catalog.status }}</div>
            </div>

            <div class="card-id">{{ catalog.id }}</div>
            <h3 class="card-title">{{ catalog.name }}</h3>
            <p class="card-desc">{{ catalog.description || 'Automation workflow template.' }}</p>

            <div class="card-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {{ catalog.schedule || 'Manual' }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {{ catalog.nodes?.length || 0 }} steps
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Risk: <span :class="['risk-text', 'risk--' + (catalog.riskLevel || 'LOW').toLowerCase()]">{{ catalog.riskLevel || 'LOW' }}</span>
              </span>
              <span v-if="catalog.approvalReq" class="meta-item text-amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Approval req.
              </span>
            </div>

            <div class="card-footer">
              <button class="btn-card" @click.stop="emit('open-editor', catalog.id)">View</button>
              <button class="btn-card-primary" @click.stop="">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Run
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatusBar from './StatusBar.vue'
import { workflowCatalogs } from '../../data/workflowCatalogs'
import type { WorkflowCatalog, WorkflowStatus } from '../../types'

const emit = defineEmits<{
  'open-editor': [catalogId: string]
}>()

const catalogs = ref<WorkflowCatalog[]>(workflowCatalogs.map(c => ({
  ...c,
  status: c.status || 'AUTO',
  description: c.description || 'Standard automation workflow.',
  schedule: c.schedule || 'Manual',
  approvalReq: c.approvalReq || false,
  riskLevel: c.riskLevel || 'LOW'
})))

function getStatusColor(status: WorkflowStatus): string {
  if (status === 'AUTO') return '#10b981'
  if (status === 'REQ') return '#f59e0b'
  if (status === 'LIVE') return '#06b6d4'
  return '#64748b'
}
</script>

<style scoped>
.catalog-view { display: flex; height: 100vh; background: #050f1e; color: #e2e8f0; }

.catalog-sidebar {
  width: 240px; background: #08121f; border-right: 1px solid #1e2d3d; display: flex; flex-direction: column;
}
.sidebar-header { padding: 16px 20px; border-bottom: 1px solid #1e2d3d; }
.logo { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.logo-icon { width: 22px; height: 22px; color: #06b6d4; }
.logo-text { font-size: 14px; font-weight: 700; }
.logo-sub { font-size: 9px; font-family: monospace; color: #06b6d4; }

.nav-section { padding: 24px 20px 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #4a5568; }
.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 20px;
  color: #94a3b8; font-size: 13px; font-weight: 500; cursor: pointer;
}
.nav-item svg { width: 16px; height: 16px; }
.nav-item.active { background: rgba(6, 182, 212, 0.1); color: #06b6d4; border-right: 3px solid #06b6d4; }

.sidebar-footer {
  margin-top: auto; padding: 16px 20px; border-top: 1px solid #1e2d3d;
  display: flex; align-items: center; justify-content: space-between;
}
.user-profile { display: flex; align-items: center; gap: 10px; }
.user-avatar { width: 28px; height: 28px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; }
.user-info { display: flex; flex-direction: column; }
.user-name { font-size: 12px; font-weight: 600; }
.user-role { font-size: 9px; color: #64748b; }
.btn-logout { background: none; border: none; color: #4a5568; cursor: pointer; }
.btn-logout svg { width: 14px; height: 14px; }

.catalog-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.catalog-header { height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #1e2d3d; }

.header-breadcrumbs { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; font-family: monospace; }
.icon-grid { width: 14px; height: 14px; }
.text-white { color: #e2e8f0; font-weight: 500; }
.sep { color: #4a5568; }

.header-search-wrap { position: relative; flex: 0 1 480px; }
.search-ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: #64748b; }
.search-input { width: 100%; padding: 8px 48px 8px 36px; background: rgba(13, 21, 33, 0.6); border: 1px solid #1e2d3d; border-radius: 6px; color: #e2e8f0; font-size: 13px; outline: none; }
.search-shortcut { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 11px; color: #64748b; background: #111827; padding: 2px 6px; border-radius: 4px; }

.header-icons { display: flex; align-items: center; gap: 8px; }
.btn-icon { width: 32px; height: 32px; background: rgba(13, 21, 33, 0.6); border: 1px solid #1e2d3d; border-radius: 6px; color: #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
.btn-icon svg { width: 14px; height: 14px; }
.badge { position: absolute; top: 6px; right: 8px; width: 4px; height: 4px; background: #ef4444; border-radius: 50%; }

.catalog-content { flex: 1; padding: 32px 40px; overflow-y: auto; }
.page-title-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; }
.page-title { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
.page-subtitle { color: #64748b; font-family: monospace; font-size: 13px; }
.title-actions { display: flex; gap: 12px; }
.btn-secondary { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid #1e2d3d; color: #e2e8f0; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; }
.btn-secondary svg { width: 14px; height: 14px; }
.btn-primary { display: flex; align-items: center; gap: 6px; background: #06b6d4; border: none; color: #050f1e; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-primary svg { width: 14px; height: 14px; }

.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }

.wf-card {
  background: #0d1521; border: 1px solid #1e2d3d; border-radius: 8px; padding: 20px;
  display: flex; flex-direction: column; transition: all 0.2s; cursor: pointer;
  position: relative; overflow: hidden;
}
.wf-card:hover { border-color: #06b6d4; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
.wf-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #1e2d3d; }
.wf-card:hover::before { background: #06b6d4; }

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.card-icon { width: 32px; height: 32px; background: rgba(13, 21, 33, 0.5); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.card-icon svg { width: 16px; height: 16px; }
.card-status { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid currentColor; }
.status-auto { color: #10b981; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
.status-req { color: #f59e0b; background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); }
.status-live { color: #06b6d4; background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.2); }
.status-off { color: #64748b; background: rgba(100, 116, 139, 0.1); border-color: rgba(100, 116, 139, 0.2); }

.card-id { font-family: monospace; font-size: 11px; color: #64748b; margin-bottom: 4px; }
.card-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.card-desc { font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 20px; flex: 1; }
.card-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; font-size: 11px; color: #64748b; font-family: monospace; }
.meta-item { display: flex; align-items: center; gap: 4px; }
.meta-item svg { width: 12px; height: 12px; }
.text-amber { color: #f59e0b; }

.risk-text { font-weight: 700; }
.risk--low { color: #00e5a0; }
.risk--medium { color: #eab308; }
.risk--high { color: #f97316; }
.risk--critical { color: #ef4444; }

.card-footer { display: flex; justify-content: flex-end; gap: 10px; }
.btn-card { background: transparent; border: 1px solid #1e2d3d; color: #e2e8f0; padding: 6px 16px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; }
.btn-card:hover { background: #1e2d3d; }
.btn-card-primary { display: flex; align-items: center; gap: 6px; background: #06b6d4; border: none; color: #050f1e; padding: 6px 16px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-card-primary svg { width: 12px; height: 12px; fill: currentColor; }
.btn-card-primary:hover { background: #08c8e8; }
</style>
