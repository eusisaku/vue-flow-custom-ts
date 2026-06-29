# Phase 2: Advanced Node Types Implementation Plan

This plan details the implementation of **Phase 2 — Node Types Lanjutan** as outlined in our roadmap. The goal is to add advanced node types (Transform, Loop, Sub-Workflow, Approval, Delay, Variable) to support more complex enterprise and developer workflows.

## User Review Required
Before proceeding with the implementation of Phase 2, please review the proposed changes below. The pattern will be identical to Phase 1 (extending the TypeScript discriminated unions and dynamic Vue components). 
> [!IMPORTANT]
> The toolbar is going to get quite full with 6 additional buttons. We can either add them as buttons (like Phase 1) or consolidate the new nodes into a dropdown or a separate "Node Palette" sidebar (which is actually planned for Phase 4). For now, the plan is to add them as simple buttons to unblock the feature quickly, unless you prefer we pull the Node Palette feature from Phase 4 into this phase.

## Open Questions
- Do you want all 6 new node types added as individual buttons in the top toolbar for now, or should we use a simple native `<select>` dropdown to "Add Node..." to save space?

## Proposed Changes

---

### Type System (`src/types/node-types.ts` & `src/types/index.ts`)
We will extend the `NodeType` union and `WorkflowNodeData` union to include the 6 new types.

#### [MODIFY] [node-types.ts](file:///d:/amerta/poc/dev/eusisaku-github/vue-flow-custom-ts/src/types/node-types.ts)
- Add interfaces for `TransformNodeData`, `LoopNodeData`, `SubWorkflowNodeData`, `ApprovalNodeData`, `DelayNodeData`, and `VariableNodeData`.
- Add type guards (e.g., `isTransformNode`, `isLoopNode`, etc.).
- Update `NodeEditForm` in `index.ts` to include the union of all possible fields for these new nodes.

---

### Visual Node Component (`src/components/flow/WorkflowNode.vue`)
We will update the node renderer to display specific UI/icons for the new types.

#### [MODIFY] [WorkflowNode.vue](file:///d:/amerta/poc/dev/eusisaku-github/vue-flow-custom-ts/src/components/flow/WorkflowNode.vue)
- Add icons and styling for `transform`, `loop`, `sub-workflow`, `approval`, `delay`, and `variable` nodes.
- Expose appropriate Vue Flow handles (e.g., Loop node will have a handle for "iteration" and "done").

---

### Node Edit Modal (`src/components/flow/NodeEditModal.vue`)
We will expand the dynamic form to accommodate the configuration settings for the new nodes.

#### [MODIFY] [NodeEditModal.vue](file:///d:/amerta/poc/dev/eusisaku-github/vue-flow-custom-ts/src/components/flow/NodeEditModal.vue)
- Add the new types to the Node Type `<select>` dropdown.
- Add `<template v-if="form.nodeType === '...'">` blocks for:
  - **Transform**: Script text area.
  - **Loop**: Array variable name, Max iterations.
  - **Sub-Workflow**: Target workflow ID dropdown.
  - **Approval**: Approvers list, timeout.
  - **Delay**: Duration and unit (seconds/minutes/hours).
  - **Variable**: Variable name, Variable value, Scope (local/global).

---

### Flow Controller (`src/components/flow/WorkflowChart.vue`)
We will add factory methods to create these new node types.

#### [MODIFY] [WorkflowChart.vue](file:///d:/amerta/poc/dev/eusisaku-github/vue-flow-custom-ts/src/components/flow/WorkflowChart.vue)
- Add `addTransformNode()`, `addLoopNode()`, etc.
- Map distinct minimap colors for each new node type.
- Expose the new factory methods via `defineExpose`.

---

### Editor View (`src/components/layout/WorkflowEditorView.vue`)
We will expose the creation of these new nodes to the user.

#### [MODIFY] [WorkflowEditorView.vue](file:///d:/amerta/poc/dev/eusisaku-github/vue-flow-custom-ts/src/components/layout/WorkflowEditorView.vue)
- Add buttons (or a dropdown, pending answer to Open Question) in the editor toolbar to trigger the new factory methods.

## Verification Plan

### Manual Verification
- Launch the application (`npm run dev`).
- Open the editor and verify that all 6 new nodes can be added to the canvas.
- Double-click each node and verify that its specific settings form renders correctly in the Edit Modal.
- Update settings, save, and ensure the node displays the updated data correctly on the canvas.
- Connect edges between the new nodes and arrange the graph.
