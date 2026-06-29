# 🗺️ Workflow Node Roadmap — Multi-Context Support
> Project: `vue-flow-custom-ts`  
> Tujuan: Menjadikan workflow builder ini dapat digunakan di berbagai konteks (terminal, CI/CD, API, approval, dll)  
> Last updated: 2026-06-29

---

## 📊 Progress Overview

| Phase | Nama | Status | Selesai |
|-------|------|--------|---------|
| Phase 0 | Migrasi ke TypeScript | ✅ Done | 2026-06 |
| Phase 1 | Node Types Multi-Konteks (Dasar) | 🔄 In Progress | - |
| Phase 2 | Node Types Lanjutan | ⏳ Pending | - |
| Phase 3 | Runtime & Execution Status | ⏳ Pending | - |
| Phase 4 | Platform & Developer Experience | ⏳ Pending | - |

---

## ✅ Phase 0 — Migrasi TypeScript (SELESAI)

Semua file dikonversi dari JavaScript Options API → TypeScript Composition API.

**Yang sudah selesai:**
- [x] `src/types/index.ts` — semua interface & type definitions
- [x] `src/data/workflowCatalogs.ts` — typed data layer
- [x] `src/main.ts` — TypeScript entry point
- [x] `src/App.vue` — Composition API
- [x] `components/flow/ToastNotification.vue`
- [x] `components/flow/ConfirmModal.vue`
- [x] `components/flow/InfoModal.vue`
- [x] `components/flow/WorkflowEdge.vue`
- [x] `components/flow/WorkflowNode.vue`
- [x] `components/flow/NodeEditModal.vue`
- [x] `components/flow/WorkflowChart.vue`
- [x] `components/layout/AppHeader.vue`
- [x] `components/layout/StatusBar.vue`
- [x] `components/layout/AppSidebar.vue`
- [x] `components/layout/WorkflowEditorView.vue`
- [x] `components/layout/WorkflowCatalogView.vue`
- [x] `styles/flow.css`

**Bug fixes yang sudah dikerjakan:**
- [x] Fix `NodeTypesObject` / `EdgeTypesObject` cast di `WorkflowChart.vue`
- [x] Fix `sourceHandle: null` tidak assignable ke `string | undefined`
- [x] Fix `ComputedRef<string>` dikirim ke plain `string`
- [x] Remove unused `clearSessionsFromStorage` di `TerminalPage.vue`

---

## 🔄 Phase 1 — Node Types Multi-Konteks Dasar (IN PROGRESS)

**Goal:** Tambah 4 node type baru agar workflow bisa digunakan di luar konteks terminal.

### 1.1 Refactor Types — Discriminated Union
- [x] Ubah `WorkflowNodeData` menjadi `BaseNodeData` + per-type interface
- [x] Tambah `NodeType`: `trigger | api-call | condition | notification`
- [x] Update `EdgeType` dengan: `condition-true | condition-false | always`
- [x] Update `NodeEditForm` agar support semua type baru

### 1.2 Trigger Node
- [x] Komponen visual (extend `WorkflowNode` via `nodeType`)
- [x] Form edit: `triggerType` (webhook/schedule/manual/event), `cronExpr`, `endpoint`
- [x] Icon & badge warna tersendiri (kuning/amber)
- [x] Handle: hanya output (tidak ada input — entry point)

## ✅ Phase 1 — Node Types Multi-Konteks Dasar (SELESAI)

### Phase 1: Core Node Expansion (✅ Completed)
Tujuan: Mendukung semua tipe node baru (Trigger, API, Condition, Notification) di dalam WorkflowEditor dan rendering visual yang sesuai.

1. **Refactor Type Data `NodeTypesObject`** (✅ Done)
   - [x] Migrasi `src/types/index.ts` menjadi discriminated union (`WorkflowNodeData`)
   - [x] Tambah enum tipe node baru

2. **Visual Workflow Node (`WorkflowNode.vue`)** (✅ Done)
   - [x] Styling khusus untuk `trigger` node (icon petir, theme kuning)
   - [x] Styling khusus untuk `api-call` node (icon panah, theme biru)
   - [x] Styling khusus untuk `condition` node (icon tanda tanya, theme ungu)
   - [x] Styling khusus untuk `notification` node (icon lonceng, theme pink)

3. **WorkflowChart Update (`WorkflowChart.vue`)** (✅ Done)
   - [x] Daftarkan node type baru ke toolbar
   - [x] Update minimap color mapping

4. **Node Edit Modal (`NodeEditModal.vue`)** (✅ Done)
   - [x] Buat form dinamis berdasarkan `nodeType`
   - [x] Tambahkan field settings untuk API (url, method)
   - [x] Tambahkan field settings untuk Condition (operand, operator)

---

## 🔄 Phase 2 — Node Types Lanjutan (IN PROGRESS)

**Goal:** Tambah node untuk power users dan enterprise use case.

### 2.1 Transform Node
- [ ] Script editor (JS expression / JSONata)
- [ ] Input/output schema preview

### 2.2 Loop Node
- [ ] Iterate over array/collection
- [ ] `maxIterations` guard
- [ ] Handle: output per iteration + done

### 2.3 Sub-Workflow Node
- [ ] Embed workflow lain sebagai satu node
- [ ] Dropdown pilih workflow dari catalog
- [ ] Input/output variable mapping

### 2.4 Approval Node
- [ ] Human-in-the-loop gate
- [ ] `approvers` list, `timeoutHours`, `fallback` action
- [ ] Status: waiting / approved / rejected / timeout

### 2.5 Delay / Wait Node
- [ ] Timer dengan `duration` + `unit`
- [ ] Visual countdown (runtime)

### 2.6 Variable Node
- [ ] Set/get shared context variables
- [ ] Scope: local (workflow) atau global (cross-workflow)

---

## ⏳ Phase 3 — Runtime & Execution Status

**Goal:** Node menampilkan status eksekusi secara visual (real-time).

### 3.1 Node Run Status
- [ ] Tambah `runStatus: 'idle' | 'running' | 'success' | 'error' | 'skipped'`
- [ ] Border & badge animasi per status
- [ ] Pulse animation untuk status `running`

### 3.2 Execution Output Panel
- [ ] Accordion di dalam node untuk stdout/stderr
- [ ] `runOutput: string[]`, `runDuration: number`, `errorMessage: string`

### 3.3 WebSocket / SSE Integration
- [ ] `composables/useExecution.ts`
- [ ] Real-time update node status dari backend

### 3.4 Execution History
- [ ] Sidebar panel list eksekusi
- [ ] Filter by date, status, node

---

## ⏳ Phase 4 — Platform & Developer Experience

**Goal:** Workflow builder siap menjadi platform.

### 4.1 Node Palette (Sidebar)
- [ ] Panel kiri drag-and-drop semua node type
- [ ] Search/filter, category grouping

### 4.2 Undo/Redo
- [ ] `composables/useEditorHistory.ts`
- [ ] Ctrl+Z / Ctrl+Y, max 50 langkah

### 4.3 Multi-select & Bulk Operations
- [ ] Shift+Click, bulk delete/move, group nodes

### 4.4 Copy/Paste Nodes
- [ ] Ctrl+C/V dengan offset position

### 4.5 Import/Export
- [ ] Export JSON, Import JSON, Export PNG/SVG

### 4.6 Workflow Validation
- [ ] Isolated node, cycle detection, required field per type

### 4.7 Variable Binding UI
- [ ] `{{variableName}}` syntax di form fields

---

## 📁 Struktur File Target

```
src/
├── types/
│   ├── index.ts              ← SUDAH ADA (di-update Phase 1)
│   └── node-types.ts         ← BARU Phase 1: discriminated union per node
├── components/
│   ├── flow/
│   │   ├── WorkflowNode.vue  ← SUDAH ADA (extended Phase 1)
│   │   ├── WorkflowEdge.vue  ← SUDAH ADA
│   │   ├── WorkflowChart.vue ← SUDAH ADA (di-update Phase 1)
│   │   └── NodeEditModal.vue ← SUDAH ADA (di-update Phase 1)
│   └── layout/
│       └── NodePalette.vue   ← BARU Phase 4
├── composables/
│   ├── useEditorHistory.ts   ← BARU Phase 4
│   └── useExecution.ts       ← BARU Phase 3
└── docs/
    ├── ROADMAP.md            ← FILE INI
    └── IMPLEMENTATION_PLAN.md (root)
```

---

## 📝 Catatan Desain

> [!NOTE]
> **Node Architecture**: Semua node type baru menggunakan `WorkflowNode.vue` sebagai
> base yang merender konten berbeda berdasarkan `data.nodeType` (discriminated union).
> Tidak perlu komponen terpisah per type — cukup extend logic di satu komponen.

> [!TIP]
> **Discriminated Union**: `WorkflowNodeData` diubah ke union type sehingga TypeScript
> bisa narrow type secara otomatis — `node.data.url` hanya ada di `ApiCallNodeData`.

> [!WARNING]
> **Breaking Change di Phase 1**: Perubahan `WorkflowNodeData` membutuhkan update
> di `NodeEditModal.vue`, `WorkflowChart.vue`, dan `workflowCatalogs.ts`.

---

*Dokumen ini dikelola di: `docs/ROADMAP.md`*
*Lihat juga: `IMPLEMENTATION_PLAN.md` (plan backend integration)*
