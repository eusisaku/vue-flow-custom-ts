# 📋 Implementation Plan — vue-flow-custom-ts

> **Catatan**: Dokumen ini adalah roadmap pengembangan lanjutan dari POC awal.
> Project asal: `vue-flow-custom` (JavaScript)
> Project ini: `vue-flow-custom-ts` (TypeScript + Composition API)

---

## ✅ Status Migrasi (Selesai)

Semua file berhasil dikonversi dari JavaScript Options API → TypeScript Composition API (`<script setup lang="ts">`).

| File | Status |
|------|--------|
| `src/types/index.ts` | ✅ Baru — semua interface & type definitions |
| `src/data/workflowCatalogs.ts` | ✅ Typed data layer |
| `src/main.ts` | ✅ TypeScript entry point |
| `src/App.vue` | ✅ Composition API |
| `components/flow/ToastNotification.vue` | ✅ `defineExpose({ show })` |
| `components/flow/ConfirmModal.vue` | ✅ Typed emits & props |
| `components/flow/InfoModal.vue` | ✅ Simple typed props |
| `components/flow/WorkflowEdge.vue` | ✅ Typed edge props |
| `components/flow/WorkflowNode.vue` | ✅ ResizeObserver + typed |
| `components/flow/NodeEditModal.vue` | ✅ Typed form state |
| `components/flow/WorkflowChart.vue` | ✅ `defineExpose` for parent ref |
| `components/layout/AppHeader.vue` | ✅ Simple props |
| `components/layout/StatusBar.vue` | ✅ Typed status |
| `components/layout/AppSidebar.vue` | ✅ Typed catalog props |
| `components/layout/WorkflowEditorView.vue` | ✅ Main editor view |
| `components/layout/WorkflowCatalogView.vue` | ✅ Catalog listing |
| `styles/flow.css` | ✅ Copied verbatim |

---

## 🚀 Phase 1 — Backend Integration (Next Step)

### 1.1 API Layer Setup

Saat ini data catalog masih **hardcoded** di `src/data/workflowCatalogs.ts`.
Perlu dibuat layer API untuk koneksi ke backend.

```
src/
├── api/
│   ├── client.ts          # Axios/fetch wrapper dengan base URL & auth header
│   ├── workflows.ts       # GET /workflows, POST /workflows, PUT /workflows/:id
│   ├── executions.ts      # POST /executions/run, GET /executions/:id/status
│   └── auth.ts            # POST /auth/login, POST /auth/refresh
├── composables/
│   ├── useWorkflows.ts    # Data fetching + state management untuk catalogs
│   ├── useExecution.ts    # Real-time polling/WebSocket untuk run status
│   └── useAuth.ts         # Login state, token management
```

**Endpoint yang dibutuhkan (Backend):**
- `GET /api/v1/workflows` → list semua catalog
- `GET /api/v1/workflows/:id` → detail + nodes + edges
- `POST /api/v1/workflows` → buat workflow baru
- `PUT /api/v1/workflows/:id` → update workflow
- `DELETE /api/v1/workflows/:id` → hapus workflow
- `POST /api/v1/workflows/:id/execute` → jalankan workflow
- `GET /api/v1/executions/:id` → cek status eksekusi

### 1.2 State Management

> ⚠️ **Decision Required**: Pinia atau simple composables?

**Opsi A — Pinia (recommended untuk production):**
```bash
npm install pinia
```
```
src/stores/
├── workflowStore.ts   # catalog list, active catalog, loading state
├── editorStore.ts     # unsaved changes, undo/redo history
└── authStore.ts       # user info, token, permissions
```

**Opsi B — Composables only (simpler, cukup untuk POC lanjut):**
- Tidak perlu install tambahan
- State dalam composable functions
- Lebih mudah di-test

---

## 🔐 Phase 2 — Authentication & Authorization

### 2.1 Login Flow
- Login page dengan JWT
- Token disimpan di `localStorage` / `httpOnly cookie`
- Auto-refresh token sebelum expired
- Route guard dengan Vue Router

### 2.2 Role-based Access
- `SUPERADMIN`: full access (CRUD + Execute)
- `OPERATOR`: read + execute only
- `VIEWER`: read only

```typescript
// types/auth.ts
type UserRole = 'SUPERADMIN' | 'OPERATOR' | 'VIEWER'

interface User {
  id: string
  name: string
  role: UserRole
  permissions: string[]
}
```

### 2.3 Routing Setup
```bash
npm install vue-router
```
```
src/router/
├── index.ts       # createRouter + routes
├── guards.ts      # beforeEach auth check
└── routes.ts      # route definitions
```

**Routes:**
- `/login` → LoginPage.vue
- `/` → WorkflowCatalogView (protected)
- `/editor/:id` → WorkflowEditorView (protected)
- `/executions` → ExecutionHistory (protected)

---

## 🎯 Phase 3 — Workflow Execution Engine (UI)

### 3.1 Real-time Execution Monitor

Saat workflow dijalankan, UI perlu menampilkan:
- Node mana yang sedang berjalan (highlighted)
- Output per node (stdout/stderr)
- Progress bar
- Error handling

**Implementasi:**
```typescript
// WebSocket untuk real-time update
const ws = new WebSocket(`ws://api/executions/${executionId}/stream`)
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // update node status: running | success | failure
}
```

### 3.2 Node Status Visual

Tambahkan state visual ke `WorkflowNode.vue`:

```typescript
type NodeRunStatus = 'idle' | 'running' | 'success' | 'failure' | 'skipped'

// Di WorkflowNodeData
interface WorkflowNodeData {
  // ... existing fields
  runStatus?: NodeRunStatus     // NEW: untuk live execution
  runOutput?: string[]          // NEW: stdout lines
  runDuration?: number          // NEW: ms
}
```

---

## 📊 Phase 4 — Execution History & Analytics

### 4.1 Execution History Page
- List semua eksekusi (filter by date, status, workflow)
- Detail per eksekusi (node-by-node log)
- Export ke CSV/PDF

### 4.2 Dashboard
- Summary cards: total workflows, running, failed today
- Chart: executions per day (last 30 days)
- Recent activity feed

---

## 🔧 Phase 5 — Advanced Editor Features

### 5.1 Undo/Redo
```typescript
// composables/useEditorHistory.ts
const history = ref<FlowElement[][]>([])
const historyIndex = ref(-1)

function pushHistory(elements: FlowElement[]) { ... }
function undo() { ... }
function redo() { ... }
```

### 5.2 Multi-node Selection & Bulk Delete
- Shift+Click untuk multi-select
- Delete key untuk hapus selected nodes

### 5.3 Copy/Paste Nodes
- Ctrl+C/Ctrl+V untuk duplicate nodes

### 5.4 Workflow Validation
- Cek apakah ada isolated nodes (tanpa koneksi)
- Cek cycle detection (loop tidak valid)
- Warning sebelum save jika ada masalah

### 5.5 Import/Export
- Export workflow sebagai JSON
- Import workflow dari file JSON

---

## 🌐 Phase 6 — Production Readiness

### 6.1 Environment Config
```
.env.development    → VITE_API_URL=http://localhost:8000
.env.staging        → VITE_API_URL=https://staging.api.pushconfig.id
.env.production     → VITE_API_URL=https://api.pushconfig.id
```

### 6.2 Error Handling & Monitoring
- Global error handler
- Toast untuk API errors
- Sentry integration (optional)

### 6.3 Performance
- Virtual scroll untuk catalog list (jika > 100 items)
- Lazy load components
- Node memoization agar tidak re-render

### 6.4 Testing
```bash
npm install -D vitest @vue/test-utils
```
- Unit test untuk composables
- Component test untuk modals
- E2E test dengan Playwright (optional)

---

## 📁 Struktur Target (Full Production)

```
vue-flow-custom-ts/
├── src/
│   ├── api/              [BARU] API layer
│   ├── assets/
│   ├── components/
│   │   ├── flow/         [DONE] ✅
│   │   ├── layout/       [DONE] ✅
│   │   ├── common/       [BARU] Reusable UI components
│   │   └── execution/    [BARU] Execution monitor components
│   ├── composables/      [PARTIAL] useFlow.ts perlu diisi
│   ├── data/             [DONE] ✅ workflowCatalogs.ts
│   ├── router/           [BARU] Vue Router
│   ├── stores/           [BARU] Pinia stores
│   ├── styles/           [DONE] ✅ flow.css
│   ├── types/            [DONE] ✅ index.ts
│   ├── views/            [BARU] Dedicated page views
│   ├── App.vue           [DONE] ✅
│   └── main.ts           [DONE] ✅
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── IMPLEMENTATION_PLAN.md  ← Dokumen ini
```

---

## 📝 Known Issues & Notes

> [!NOTE]
> **dagre type issue**: Package `dagre` tidak memiliki official `@types/dagre`.
> Package `@types/dagre` di npm sudah terinstall dan cukup untuk suppress error TypeScript.
> Jika masih ada error, tambahkan `// @ts-expect-error` di baris import dagre.

> [!WARNING]
> **`noUnusedLocals` & `noUnusedParameters`**: tsconfig default dari Vite menyalakan ini.
> Beberapa computed properties (misal `_commandNodes`, `_fnNodes` di WorkflowChart) mungkin
> trigger lint error. Prefix dengan `_` untuk suppress, atau disable rule di tsconfig.

> [!TIP]
> **Vue DevTools**: Sudah include `vite-plugin-vue-devtools` di devDependencies.
> Install extension browser untuk debugging yang lebih mudah.

---

## 🔗 Referensi

- [Vue Flow Docs](https://vueflow.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq)
- [TypeScript + Vue 3](https://vuejs.org/guide/typescript/overview)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)

---

*Last updated: 2026-06-25 | Author: NOC Automation Team*
