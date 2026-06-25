<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="logo-wrap">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="18" height="18">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
      </div>
      <div>
        <div class="logo-text">Workflow Editor</div>
        <div class="logo-sub">NOC Automation v4</div>
      </div>
    </div>

    <!-- Navigation Body -->
    <nav class="sidebar-body">
      <!-- Search -->
      <div class="sidebar-search-wrap">
        <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" class="sidebar-search-input" placeholder="Search catalogs...">
        <span class="search-shortcut mono">⌘K</span>
      </div>

      <!-- Catalog Section -->
      <div class="nav-section">Workflow Catalog</div>

      <div
        v-for="catalog in catalogs"
        :key="catalog.id"
        :class="['nav-item', activeCatalogId === catalog.id && 'active']"
        @click="selectCatalog(catalog)"
      >
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
        <div class="nav-item__content">
          <div class="nav-item__code">{{ catalog.code }}</div>
          <div class="nav-item__name">{{ catalog.name }}</div>
        </div>
        <span class="nav-badge" :class="'badge-' + catalog.statusColor">{{ catalog.status }}</span>
      </div>

      <!-- Info Section -->
      <div class="nav-section" style="margin-top: 16px;">Info</div>
      <div class="nav-item nav-item--static">
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>{{ activeCatalog ? activeCatalog.steps + ' Steps' : '—' }}</span>
      </div>
      <div class="nav-item nav-item--static">
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ activeCatalog ? activeCatalog.schedule : '—' }}</span>
      </div>
      <div class="nav-item nav-item--desc" v-if="activeCatalog">
        {{ activeCatalog.description }}
      </div>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="user-avatar">AR</div>
      <div class="user-info">
        <div class="user-name">Ahmad Rizky</div>
        <div class="user-role">SUPERADMIN</div>
      </div>
      <button class="logout-btn" title="Sign Out">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowCatalog } from '../../types'

const props = defineProps<{
  catalogs: WorkflowCatalog[]
  activeCatalogId?: string | null
}>()

const emit = defineEmits<{
  'select-catalog': [catalog: WorkflowCatalog]
}>()

const activeCatalog = computed(() =>
  props.catalogs.find(c => c.id === props.activeCatalogId) ?? null
)

function selectCatalog(catalog: WorkflowCatalog): void {
  emit('select-catalog', catalog)
}
</script>

<style scoped>
.sidebar {
  position: fixed; left: 0; top: 0; bottom: 0;
  width: var(--sidebar-w, 220px);
  background: var(--navy-900, #050f1e);
  border-right: 1px solid var(--border, #1e2d3d);
  display: flex; flex-direction: column;
  z-index: 100; overflow: hidden;
}
.sidebar::after {
  content: '';
  position: absolute; right: 0; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(to bottom, transparent, #06b6d4, transparent);
  opacity: 0.25; pointer-events: none;
}

.logo-wrap {
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--border, #1e2d3d);
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.logo-icon {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.logo-text { font-size: 14px; font-weight: 700; letter-spacing: 0.5px; color: #e2e8f0; }
.logo-sub { font-size: 9px; font-family: var(--font-mono, monospace); color: #06b6d4; letter-spacing: 1.5px; text-transform: uppercase; }

.sidebar-search-wrap { position: relative; margin: 12px 16px 8px; }
.search-ico {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  width: 13px; height: 13px; color: #4a5568; pointer-events: none;
}
.sidebar-search-input {
  width: 100%; padding: 6px 40px 6px 30px;
  background: #0d1521; border: 1px solid #1e2d3d; border-radius: 7px;
  color: #e2e8f0; font-family: var(--font-mono, monospace); font-size: 11px; outline: none;
  transition: border-color 0.15s; box-sizing: border-box;
}
.sidebar-search-input:focus { border-color: #06b6d4; }
.sidebar-search-input::placeholder { color: #4a5568; }
.search-shortcut {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  font-size: 9px; color: #4a5568; background: #111827; padding: 1px 5px; border-radius: 3px;
  font-family: var(--font-mono, monospace);
}

.sidebar-body { flex: 1; overflow-y: auto; padding: 8px 0 16px; }
.sidebar-body::-webkit-scrollbar { width: 4px; }
.sidebar-body::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 2px; }

.nav-section {
  padding: 16px 16px 4px; font-size: 9.5px; font-weight: 600;
  font-family: var(--font-mono, monospace); letter-spacing: 1.8px; text-transform: uppercase; color: #4a5568;
}
.nav-item {
  display: flex; align-items: center; gap: 9px; padding: 8px 16px;
  margin: 1px 8px; border-radius: 6px; font-size: 12px; font-weight: 400;
  color: #94a3b8; cursor: pointer; transition: all 0.15s; position: relative;
}
.nav-item:hover { background: rgba(6, 182, 212, 0.07); color: #67e8f9; }
.nav-item.active { background: rgba(6, 182, 212, 0.12); color: #67e8f9; font-weight: 500; }
.nav-item.active::before {
  content: ''; position: absolute; left: -8px; top: 50%; transform: translateY(-50%);
  width: 3px; height: 16px; background: #06b6d4; border-radius: 0 2px 2px 0;
}
.nav-item--static { cursor: default; color: #4a5568; font-size: 11px; }
.nav-item--static:hover { background: transparent; color: #4a5568; }
.nav-item--desc {
  cursor: default; font-size: 10px; color: #4a5568;
  padding: 4px 16px 8px; line-height: 1.5; margin: 0 8px; border-radius: 6px;
}
.nav-item--desc:hover { background: transparent; color: #4a5568; }
.nav-item__content { flex: 1; min-width: 0; }
.nav-item__code { font-size: 9px; font-family: var(--font-mono, monospace); color: #4a5568; margin-bottom: 1px; }
.nav-item__name { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ico { width: 14px; height: 14px; opacity: 0.7; flex-shrink: 0; }

.nav-badge {
  padding: 1px 6px; border-radius: 8px; font-size: 9px;
  font-family: var(--font-mono, monospace); font-weight: 600; flex-shrink: 0;
}
.badge-cyan  { background: rgba(6, 182, 212, 0.15);  color: #67e8f9; }
.badge-amber { background: rgba(245, 158, 11, 0.15); color: #fcd34d; }
.badge-green { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; }
.badge-red   { background: rgba(239, 68, 68, 0.15);  color: #fca5a5; }
.badge-gray  { background: rgba(100, 116, 139, 0.15); color: #94a3b8; }

.sidebar-footer {
  padding: 12px 16px; border-top: 1px solid var(--border, #1e2d3d);
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.user-avatar {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
}
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 12px; font-weight: 500; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 9px; font-family: var(--font-mono, monospace); color: #06b6d4; text-transform: uppercase; letter-spacing: 0.5px; }
.logout-btn {
  background: transparent; border: none; cursor: pointer;
  padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  color: #4a5568; transition: all 0.2s; flex-shrink: 0; outline: none;
}
.logout-btn:hover { background: rgba(239, 68, 68, 0.1); color: #f87171; }
</style>
