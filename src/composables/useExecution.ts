import { ref, type Ref } from 'vue';
import { useVueFlow, type Node } from '@vue-flow/core';
import { type NodeRunStatus } from '../types/node-types'; // Sesuaikan path jika perlu

/**
 * Composable untuk mengelola state eksekusi workflow.
 *
 * @returns Objek dengan fungsi dan state untuk eksekusi.
 */
export function useExecution() {
  const { updateNodeData } = useVueFlow();

  const isExecuting = ref(false);
  const executionLog: Ref<string[]> = ref([]);

  /**
   * Memperbarui status dan data sebuah node.
   * @param nodeId - ID dari node yang akan diperbarui.
   * @param status - Status eksekusi baru.
   * @param data - Data tambahan seperti output, durasi, atau pesan error.
   */
  const updateNodeExecutionState = (
    nodeId: string,
    status: NodeRunStatus,
    data: {
      output?: string[];
      duration?: number;
      error?: string;
    } = {}
  ) => {
    const logMessage = `[${new Date().toISOString()}] Node ${nodeId} -> ${status}`;
    executionLog.value.push(logMessage);

    updateNodeData(nodeId, {
      runStatus: status,
      runOutput: data.output,
      runDuration: data.duration,
      errorMessage: data.error,
    });
  };

  /**
   * Memulai proses eksekusi workflow.
   * (Ini adalah placeholder, logika sesungguhnya akan bergantung pada backend)
   * @param nodes - Array dari semua node di dalam flow.
   */
  const startExecution = async (nodes: Node[]) => {
    if (isExecuting.value) return;

    isExecuting.value = true;
    executionLog.value = ['--- Workflow Execution Started ---'];

    // Reset status semua node ke 'idle'
    nodes.forEach(node => updateNodeExecutionState(node.id, 'idle'));

    // TODO: Implementasikan logika eksekusi di sini.
    // Biasanya akan melibatkan traversal graph dan memanggil backend via WebSocket/SSE.

    isExecuting.value = false;
  };

  return { isExecuting, executionLog, startExecution, updateNodeExecutionState };
}