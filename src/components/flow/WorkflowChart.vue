<template>
  <div class="wf-container">
    <VueFlow
      v-model="elements"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      :default-viewport="defaultViewport"
      :min-zoom="0.2"
      :max-zoom="4"
      :snap-to-grid="true"
      :snap-grid="[15, 15]"
      :connection-mode="ConnectionMode.Loose"
      @node-click="onNodeClick"
      @node-double-click="onNodeDblClick"
      @connect="onConnect"
      @edge-update="onEdgeUpdate"
      @edge-double-click="onEdgeDblClick"
      fit-view-on-init
      class="wf-flow"
    >
      <Background variant="dots" :gap="28" :size="1.3" color="#1a2535" />
      <Controls position="bottom-left" />
      <MiniMap
        :style="{ height: '140px', width: '185px', background: '#0a1020', border: '1px solid #1e2d3d', borderRadius: '10px' }"
        :node-color="() => '#182030'"
        :node-stroke-color="() => '#00e5a0'"
        :mask-color="'rgba(0,229,160,0.04)'"
      />
    </VueFlow>

    <!-- Edit Modal -->
    <NodeEditModal
      v-model="showEditModal"
      :node-id="editingNodeId"
      :node-data="editingNodeData"
      @save="onSaveNode"
      @delete="onDeleteNode"
    />

    <!-- Info Modal -->
    <InfoModal v-model="showInfoModal" />

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="showConfirm"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :type="confirmConfig.type"
      :confirm-text="confirmConfig.confirmText"
      @confirm="executeConfirm"
    />

    <!-- Toast Notifications -->
    <ToastNotification ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { VueFlow, useVueFlow, ConnectionMode } from '@vue-flow/core'
import type { Connection, EdgeUpdateEvent, NodeMouseEvent, EdgeMouseEvent } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import dagre from 'dagre'
import WorkflowNode from './WorkflowNode.vue'
import WorkflowEdge from './WorkflowEdge.vue'
import NodeEditModal from './NodeEditModal.vue'
import InfoModal from './InfoModal.vue'
import ToastNotification from './ToastNotification.vue'
import ConfirmModal from './ConfirmModal.vue'
import type { WorkflowCatalog, WorkflowNodeData, ConfirmConfig, FlowElement, WorkflowEdgeElement, WorkflowNodeElement, EdgeType } from '../../types'

interface Props {
  catalog?: WorkflowCatalog | null
  edgeTypeProp?: string
}

const props = withDefaults(defineProps<Props>(), {
  catalog: null,
  edgeTypeProp: 'success'
})

const emit = defineEmits<{
  'update:edgeType': [type: string]
}>()

const { addEdges, addNodes, fitView, updateNodeInternals } = useVueFlow()

// ─── State ───────────────────────────────────────────────────────────────────
const defaultViewport = { x: 80, y: 60, zoom: 0.85 }
const nodeTypes = { workflow: WorkflowNode }
const edgeTypes = { workflow: WorkflowEdge }
const elements = ref<FlowElement[]>([])
const nodeCounter = ref(0)
const edgeType = ref<EdgeType>(props.edgeTypeProp as EdgeType || 'success')

const showEditModal = ref(false)
const showInfoModal = ref(false)
const showConfirm = ref(false)
const confirmConfig = ref<ConfirmConfig>({ title: '', message: '', type: 'warning', confirmText: 'Ya' })
const confirmCallback = ref<(() => void) | null>(null)
const editingNodeId = ref('')
const editingNodeData = ref<WorkflowNodeData | null>(null)
const toastRef = ref<InstanceType<typeof ToastNotification> | null>(null)

// ─── Computed ─────────────────────────────────────────────────────────────────
const _commandNodes = computed(() =>
  elements.value.filter(e => (e as WorkflowNodeElement).data?.nodeType === 'command').length
)
const _fnNodes = computed(() =>
  elements.value.filter(e => (e as WorkflowNodeElement).data?.nodeType === 'function').length
)

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(() => props.catalog, (newCatalog) => {
  loadCatalog(newCatalog ?? null)
})
watch(() => props.edgeTypeProp, (val) => {
  edgeType.value = val as EdgeType
})

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  loadCatalog(props.catalog ?? null)
})

// ─── Methods ─────────────────────────────────────────────────────────────────
function toast(msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'success'): void {
  toastRef.value?.show(msg, type)
}

function requestConfirm(options: ConfirmConfig, callback: () => void): void {
  confirmConfig.value = options
  confirmCallback.value = callback
  showConfirm.value = true
}

function executeConfirm(): void {
  confirmCallback.value?.()
}

function layoutGraph(): void {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 60 })
  g.setDefaultEdgeLabel(() => ({}))

  elements.value.forEach(el => {
    const node = el as WorkflowNodeElement
    const edge = el as WorkflowEdgeElement
    if (!edge.source && !edge.target) {
      const width = 300
      const height = node.data?.nodeType === 'function' ? 120 : 250
      g.setNode(el.id, { width, height })
    }
  })

  elements.value.forEach(el => {
    const edge = el as WorkflowEdgeElement
    if (edge.source && edge.target) {
      g.setEdge(edge.source, edge.target)
    }
  })

  dagre.layout(g)

  elements.value = elements.value.map(el => {
    const edge = el as WorkflowEdgeElement
    if (!edge.source && !edge.target) {
      const nodeWithPos = g.node(el.id)
      return {
        ...el,
        position: {
          x: nodeWithPos.x - nodeWithPos.width / 2,
          y: nodeWithPos.y - nodeWithPos.height / 2
        }
      }
    }
    return el
  })

  setTimeout(() => {
    fitView({ padding: 0.2, duration: 800 })
  }, 50)
}

function makeEdge(id: string, source: string, target: string, type: EdgeType = 'success'): WorkflowEdgeElement {
  return {
    id,
    type: 'workflow',
    source,
    target,
    sourceHandle: type,
    targetHandle: 'top',
    updatable: true,
    data: { type }
  }
}

function loadCatalog(catalog: WorkflowCatalog | null): void {
  if (!catalog) {
    initWorkflow()
    return
  }
  const editFn = (nodeId: string) => openEditByNodeId(nodeId)
  const nodes: WorkflowNodeElement[] = (catalog.nodes || []).map(n => ({
    ...n,
    data: { ...n.data, onEdit: editFn }
  }))
  const edges: WorkflowEdgeElement[] = (catalog.edges || []).map(e => ({
    ...e,
    updatable: true
  }))
  elements.value = [...nodes, ...edges]
  nodeCounter.value = nodes.length
  setTimeout(() => { layoutGraph() }, 50)
}

function initWorkflow(): void {
  const editFn = (nodeId: string) => openEditByNodeId(nodeId)
  try {
    const saved = localStorage.getItem('vue-flow-workspace-ts')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && Array.isArray(parsed.elements) && parsed.elements.length > 0) {
        parsed.elements.forEach((el: FlowElement) => {
          const node = el as WorkflowNodeElement
          if (node.data?.nodeType) {
            node.data.onEdit = editFn
          }
        })
        elements.value = parsed.elements
        nodeCounter.value = parsed.nodeCounter || 10
        setTimeout(() => {
          fitView({ padding: 0.2, duration: 500 })
          toast('Workspace restored from local storage', 'info')
        }, 50)
        return
      }
    }
  } catch (e) {
    console.error('Failed to load workspace', e)
  }
  elements.value = []
  nodeCounter.value = 0
}

function addCommandNode(): void {
  const id = String(++nodeCounter.value)
  elements.value.push({
    id, type: 'workflow',
    position: { x: 150 + Math.random() * 350, y: 150 + Math.random() * 350 },
    data: {
      nodeType: 'command',
      label: `${id}. New Command Node`,
      subtitle: '1 command(s)',
      onEdit: (nid: string) => openEditByNodeId(nid),
      commands: [{ text: 'echo "Hello World"' }]
    }
  })
}

function addFunctionNode(): void {
  const id = String(++nodeCounter.value)
  elements.value.push({
    id, type: 'workflow',
    position: { x: 150 + Math.random() * 350, y: 150 + Math.random() * 350 },
    data: {
      nodeType: 'function',
      label: `${id}. New Function`,
      subtitle: 'myFunction',
      params: 'myFunction',
      bound: '1 BOUND',
      onEdit: (nid: string) => openEditByNodeId(nid)
    }
  })
}

function onNodeClick({ node, event }: NodeMouseEvent): void {
  const target = event?.target as HTMLElement | null
  if (target?.closest('[data-expand-toggle]')) {
    const idx = elements.value.findIndex(e => e.id === node.id)
    if (idx !== -1) {
      const el = elements.value[idx] as WorkflowNodeElement
      elements.value[idx] = {
        ...el,
        data: { ...el.data, expanded: !el.data?.expanded }
      }
    }
  }
}

function onNodeDblClick({ node }: NodeMouseEvent): void {
  openEditModal(node as unknown as WorkflowNodeElement)
}

function openEditByNodeId(nodeId: string): void {
  const el = elements.value.find(e => e.id === nodeId) as WorkflowNodeElement | undefined
  if (el) openEditModal(el)
}

function openEditModal(node: WorkflowNodeElement): void {
  editingNodeId.value = node.id
  editingNodeData.value = { ...node.data }
  showEditModal.value = true
}

function onConnect(connection: Connection): void {
  if (connection.source && connection.target) {
    const id = `e${connection.source}-${connection.target}-${Date.now()}`
    elements.value.push(makeEdge(id, connection.source, connection.target, edgeType.value))
  }
}

function onEdgeUpdate({ edge, connection }: EdgeUpdateEvent): void {
  elements.value = elements.value.map(el => {
    if (el.id === edge.id) {
      return {
        ...el,
        source: connection.source ?? el.id,
        target: connection.target ?? (el as WorkflowEdgeElement).target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle
      }
    }
    return el
  })
}

function onEdgeDblClick({ edge }: EdgeMouseEvent): void {
  requestConfirm({
    title: 'Hapus Garis',
    message: 'Apakah Anda yakin ingin menghapus garis koneksi ini?',
    type: 'danger',
    confirmText: 'Hapus'
  }, () => {
    elements.value = elements.value.filter(el => el.id !== edge.id)
  })
}

function onSaveNode({ nodeId, data }: { nodeId: string; data: Partial<WorkflowNodeData> }): void {
  const idx = elements.value.findIndex(el => el.id === nodeId)
  if (idx !== -1) {
    const el = elements.value[idx] as WorkflowNodeElement
    elements.value[idx] = { ...el, data: { ...el.data, ...data } }
    elements.value = [...elements.value]
  }
}

function onDeleteNode(nodeId: string): void {
  elements.value = elements.value.filter(el => {
    if (el.id === nodeId) return false
    const edge = el as WorkflowEdgeElement
    if (edge.source === nodeId || edge.target === nodeId) return false
    return true
  })
}

function autoArrange(): void {
  layoutGraph()
}

function resetFlow(): void {
  requestConfirm({
    title: 'Reset Template',
    message: 'Reset workflow ke template default?',
    type: 'warning',
    confirmText: 'Reset'
  }, () => {
    localStorage.removeItem('vue-flow-workspace-ts')
    elements.value = []
    nodeCounter.value = 0
    initWorkflow()
    toast('Template default dimuat ulang')
  })
}

function saveWorkspace(): void {
  try {
    const data = { elements: elements.value, nodeCounter: nodeCounter.value }
    localStorage.setItem('vue-flow-workspace-ts', JSON.stringify(data))
    toast('Workspace berhasil disave!', 'success')
  } catch (e) {
    toast('Gagal save workspace: ' + (e as Error).message, 'error')
  }
}

// Expose methods for parent ref usage
defineExpose({
  addCommandNode,
  addFunctionNode,
  autoArrange,
  resetFlow,
  saveWorkspace
})
</script>

<style scoped>
.wf-container {
  width: 100%;
  height: 100%;
  background: #070d18;
  position: relative;
}
</style>
