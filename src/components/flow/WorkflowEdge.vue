<template>
  <!-- Custom edge with dashed line + animated arrow -->
  <BaseEdge :id="id" :path="edgePath" :style="edgeStyle" />
  <!-- Arrowhead marker -->
  <svg style="position:absolute;width:0;height:0;overflow:hidden;">
    <defs>
      <marker :id="`arrow-${id}`" viewBox="0 0 10 10" refX="9" refY="5"
        :markerWidth="6" :markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="color" />
      </marker>
    </defs>
  </svg>
  <!-- Clickable edge label & sequence -->
  <EdgeLabelRenderer>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }"
    >
      <div v-if="data?.sequence" class="wf-edge-sequence">
        {{ data.sequence }}
      </div>
      <div v-if="data?.label"
        class="wf-edge-label"
        :class="data?.labelType === 'failure' ? 'wf-edge-label--failure' : 'wf-edge-label--success'"
      >
        {{ data.label }}
      </div>
    </div>
  </EdgeLabelRenderer>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position } from '@vue-flow/core'
import type { WorkflowEdgeData } from '../../types'

interface Props {
  id: string
  source: string
  target: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  data?: WorkflowEdgeData
  markerEnd?: string
  style?: Record<string, string>
}

const props = defineProps<Props>()

const color = computed<string>(() =>
  props.data?.type === 'failure' ? '#ff4d4d' : '#00e5a0'
)

const edgePath = computed<string>(() => {
  // Guard against NaN coords during initial render before VueFlow sets positions
  if (
    !isFinite(props.sourceX) || !isFinite(props.sourceY) ||
    !isFinite(props.targetX) || !isFinite(props.targetY)
  ) return ''

  const [path] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  })
  return path
})

const labelX = computed<number>(() =>
  isFinite(props.sourceX) && isFinite(props.targetX)
    ? (props.sourceX + props.targetX) / 2
    : 0
)
const labelY = computed<number>(() =>
  isFinite(props.sourceY) && isFinite(props.targetY)
    ? (props.sourceY + props.targetY) / 2
    : 0
)

const edgeStyle = computed<Record<string, string>>(() => ({
  stroke: color.value,
  strokeWidth: '1.8',
  strokeDasharray: '7 4',
  markerEnd: `url(#arrow-${props.id})`,
  filter: `drop-shadow(0 0 4px ${color.value}60)`,
  ...(props.style ?? {})
}))
</script>

<style scoped>
.wf-edge-sequence {
  background: #0d1521;
  color: #94a3b8;
  border: 1px solid #1e2d3d;
  font-size: 9px;
  font-weight: 800;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  font-family: var(--font-mono);
  user-select: none;
}
.wf-edge-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 5px;
  white-space: nowrap;
  cursor: default;
  user-select: none;
}
.wf-edge-label--success {
  background: #0d3020;
  color: #00e5a0;
  border: 1px solid #00e5a040;
}
.wf-edge-label--failure {
  background: #301010;
  color: #ff4d4d;
  border: 1px solid #ff4d4d40;
}
</style>
