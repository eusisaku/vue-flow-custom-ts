<template>
  <aside class="node-palette">
    <div class="palette-header">
      <input v-model="searchQuery" type="text" placeholder="Search nodes..." class="search-input" />
    </div>
    <div class="palette-content">
      <div v-if="Object.keys(groupedNodes).length === 0" class="no-results">
        No nodes found.
      </div>
      <div v-for="(group, category) in groupedNodes" :key="category" class="node-group">
        <h4 class="group-title">{{ category }}</h4>
        <div
          v-for="node in group"
          :key="node.type"
          class="palette-node"
          draggable="true"
          @dragstart="onDragStart($event, node.type)"
        >
          <!-- Anda bisa mengganti ini dengan komponen ikon kustom -->
          <span class="node-icon">{{ node.icon || '◆' }}</span>
          <span class="node-label">{{ node.label }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PaletteNode, NodeType } from '../../types'

interface Props {
  availableNodes: PaletteNode[]
}

const props = withDefaults(defineProps<Props>(), {
  availableNodes: () => [],
})

const searchQuery = ref('')

/**
 * Memfilter dan mengelompokkan node berdasarkan kategori untuk ditampilkan di palet.
 */
const groupedNodes = computed(() => {
  const filtered = props.availableNodes.filter(node =>
    node.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  return filtered.reduce((acc, node) => {
    const category = node.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(node)
    return acc
  }, {} as Record<string, PaletteNode[]>)
})

/**
 * Menangani event saat pengguna mulai menarik node dari palet.
 * Tipe node disimpan di dalam data transfer event.
 */
function onDragStart(event: DragEvent, nodeType: NodeType) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<style scoped>
.node-palette {
  width: 240px;
  height: 100%;
  background-color: #0c1421;
  border-right: 1px solid #1e2d3d;
  display: flex;
  flex-direction: column;
  color: #cbd5e1;
}

.palette-header {
  padding: 1rem;
  border-bottom: 1px solid #1e2d3d;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #1a2535;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #38bdf8;
}

.palette-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.no-results {
  text-align: center;
  color: #64748b;
  margin-top: 2rem;
}

.group-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.node-group:first-child .group-title {
  margin-top: 0;
}

.palette-node {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  cursor: grab;
  transition: background-color 0.2s;
  margin-bottom: 0.25rem;
  background-color: #1e293b;
}

.palette-node:hover {
  background-color: #334155;
}

.node-icon {
  margin-right: 0.75rem;
  font-size: 1.1rem;
  color: #94a3b8;
}

.node-label {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>