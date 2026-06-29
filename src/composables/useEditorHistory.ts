import { ref, computed } from 'vue'
import type { FlowElement } from '@vue-flow/core'

const MAX_HISTORY_SIZE = 50

/**
 * A composable for managing editor history (undo/redo).
 * It tracks snapshots of the flow elements.
 */
export function useEditorHistory() {
    // A stack of state snapshots (as JSON strings for performance and to break reactivity).
    const history = ref<string[]>([])
    // The current position in the history stack.
    const historyIndex = ref(-1)
    // A flag to prevent taking snapshots while undoing/redoing.
    const isRestoring = ref(false)

    /**
     * Checks if there are actions to undo.
     */
    const canUndo = computed(() => historyIndex.value > 0)

    /**
     * Checks if there are actions to redo.
     */
    const canRedo = computed(() => historyIndex.value < history.value.length - 1)

    /**
     * Takes a snapshot of the current state and adds it to the history stack.
     * @param elements The current array of flow elements.
     */
    function takeSnapshot(elements: FlowElement[]) {
        // If we are in the middle of the history stack, any new action
        // should erase the "future" (redo) history.
        if (historyIndex.value < history.value.length - 1) {
            history.value.splice(historyIndex.value + 1)
        }

        // Add the new state to the history.
        // We stringify the state to create a deep copy and prevent reactivity issues.
        history.value.push(JSON.stringify(elements))

        // If the history exceeds the maximum size, remove the oldest entry.
        if (history.value.length > MAX_HISTORY_SIZE) {
            history.value.shift()
        } else {
            // Only increment the index if we are not at the limit.
            historyIndex.value++
        }
    }

    /**
     * Restores the previous state from the history stack.
     * @param onRestore A callback function to apply the restored state.
     */
    function undo(onRestore: (state: FlowElement[]) => void) {
        if (!canUndo.value) return

        isRestoring.value = true
        historyIndex.value--
        const previousState = JSON.parse(history.value[historyIndex.value])
        onRestore(previousState)

        requestAnimationFrame(() => {
            isRestoring.value = false
        })
    }

    /**
     * Restores the next state (redo) from the history stack.
     * @param onRestore A callback function to apply the restored state.
     */
    function redo(onRestore: (state: FlowElement[]) => void) {
        if (!canRedo.value) return

        isRestoring.value = true
        historyIndex.value++
        const nextState = JSON.parse(history.value[historyIndex.value])
        onRestore(nextState)

        requestAnimationFrame(() => {
            isRestoring.value = false
        })
    }

    return {
        takeSnapshot,
        undo,
        redo,
        canUndo,
        canRedo,
        isRestoring,
    }
}