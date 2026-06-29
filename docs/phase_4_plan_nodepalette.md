# Phase 4: Rencana Implementasi - Node Palette

Dokumen ini menguraikan rencana implementasi untuk fitur **Node Palette**, item pertama dalam **Phase 4 — Platform & Developer Experience**.

**Tujuan:** Menggantikan menu `<select>` yang ada untuk menambahkan node dengan panel sidebar yang interaktif dan ramah pengguna. Pengguna akan dapat menarik dan melepas (drag-and-drop) tipe node langsung ke kanvas alur kerja.

---

## 🗺️ Pengalaman Pengguna (User Experience)

- Sebuah sidebar baru akan terlihat di sisi kiri `WorkflowEditorView`.
- Sidebar akan menampilkan semua tipe node yang tersedia, dikelompokkan berdasarkan kategori (misalnya, "Core", "Integration", "Advanced").
- Setiap item node akan menampilkan ikon dan label.
- Pengguna dapat menarik item node apa pun dari palet dan melepaskannya ke kanvas untuk membuat node baru dari tipe tersebut di lokasi pelepasan.
- Bilah pencarian di bagian atas palet akan memungkinkan pengguna untuk memfilter node berdasarkan nama.

---

## 🛠️ Implementasi Teknis

### 1. [BARU] Komponen `NodePalette.vue`

**Lokasi:** `src/components/layout/NodePalette.vue`

- **Tujuan:** Merender daftar item node yang dapat ditarik.
- **Struktur Data:** Akan menerima daftar node yang tersedia, misalnya:
  ```ts
  const availableNodes = [
    { type: 'command', label: 'Command', category: 'Core', icon: '...' },
    { type: 'api-call', label: 'API Call', category: 'Integration', icon: '...' },
    // ... etc
  ];
  ```
- **Logika Drag:**
  - Setiap item node akan memiliki atribut `draggable="true"`.
  - Pada event `dragstart`, tipe node (misalnya, `'api-call'`) akan disimpan di `event.dataTransfer`.
  ```html
  <div
    v-for="node in filteredNodes"
    :key="node.type"
    class="palette-node"
    draggable="true"
    @dragstart="onDragStart($event, node.type)"
  >
    <!-- icon and label -->
  </div>
  ```

### 2. [MODIFIKASI] `WorkflowEditorView.vue`

**Lokasi:** `src/components/layout/WorkflowEditorView.vue`

- **Perubahan:**
  - Impor dan integrasikan komponen `<NodePalette />` ke dalam tata letak utama.
  - Hapus menu `<select>` yang ada untuk menambahkan node, karena fungsinya digantikan oleh palet.
  - Tata letak akan diubah untuk mengakomodasi sidebar di sebelah kiri dan area `<WorkflowChart>` di sebelah kanan.

### 3. [MODIFIKASI] `WorkflowChart.vue`

**Lokasi:** `src/components/flow/WorkflowChart.vue`

- **Tujuan:** Menangani event `drop` untuk membuat node baru.
- **Perubahan:**
  - Tambahkan event listener untuk `dragover` dan `drop` pada elemen pembungkus `<VueFlow>`.
  - Gunakan `useVueFlow()` untuk mendapatkan akses ke fungsi yang diperlukan.
- **Logika `onDrop`:**
  1. Panggil `event.preventDefault()` untuk mengizinkan pelepasan.
  2. Dapatkan `nodeType` dari `event.dataTransfer`.
  3. Dapatkan posisi `x` dan `y` dari kursor mouse relatif terhadap panel alur kerja. `useVueFlow` menyediakan fungsi `project` untuk mengubah koordinat layar menjadi koordinat alur kerja.
  4. Panggil fungsi `addNewNode` yang ada (atau versi yang dimodifikasi) dengan `nodeType` dan posisi yang dihitung.

  ```ts
  // Di dalam <script setup> dari WorkflowChart.vue
  const { project, addNodes } = useVueFlow();

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    const type = event.dataTransfer?.getData('application/vueflow');
    if (!type) return;

    const position = project({ x: event.clientX, y: event.clientY });
    // addNewNode(type, position); // Gunakan fungsi yang sudah ada atau buat yang baru
  }
  ```

### 4. [MODIFIKASI] `types/index.ts`

- **Perubahan:** Tambahkan tipe baru untuk mendefinisikan struktur item di palet.
  ```ts
  export interface PaletteNode {
    type: NodeType;
    label: string;
    category: 'Core' | 'Integration' | 'Advanced' | 'Custom';
    icon?: string; // Atau komponen ikon
  }
  ```

---