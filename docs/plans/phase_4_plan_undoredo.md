# Phase 4: Rencana Implementasi - Undo/Redo

Dokumen ini menguraikan rencana implementasi untuk fitur **Undo/Redo**, item kedua dalam **Phase 4 — Platform & Developer Experience**.

**Tujuan:** Memberikan pengguna kemampuan untuk membatalkan (Undo) dan mengulangi (Redo) tindakan yang mengubah struktur alur kerja, seperti menambah, menghapus, atau memindahkan node dan koneksi.

---

## 🗺️ Pengalaman Pengguna (User Experience)

- Pengguna dapat menekan `Ctrl+Z` untuk membatalkan tindakan terakhir.
- Pengguna dapat menekan `Ctrl+Y` (atau `Ctrl+Shift+Z`) untuk mengulangi tindakan yang telah dibatalkan.
- Tombol Undo/Redo pada `AppHeader` akan menjadi aktif atau nonaktif tergantung pada apakah ada tindakan yang bisa dibatalkan atau diulangi.
- Fitur ini akan melacak hingga 50 perubahan terakhir.

---

## 🛠️ Implementasi Teknis

Implementasi akan berpusat pada sebuah *composable* Vue baru yang bertanggung jawab untuk mengelola tumpukan riwayat (history stack).

### 1. [BARU] Composable `useEditorHistory.ts`

**Lokasi:** `src/composables/useEditorHistory.ts`

- **Tujuan:** Mengabstraksikan logika untuk melacak, membatalkan, dan mengulangi status dari elemen-elemen alur kerja.
- **Struktur Internal:**
  - `history`: Sebuah `ref` ke array yang menyimpan snapshot dari `elements`. Untuk efisiensi memori dan menghindari masalah reaktivitas mendalam, setiap snapshot akan berupa string JSON. `ref<string[]>()`
  - `historyIndex`: Sebuah `ref` yang menunjuk ke posisi saat ini dalam tumpukan `history`. `ref<number>()`
  - `isRestoring`: Sebuah `ref` boolean untuk menandai kapan proses undo/redo sedang berlangsung, guna mencegah pendorongan riwayat yang tidak disengaja.

- **Fungsi yang Diekspos:**
  - `takeSnapshot(elements: FlowElement[])`: Mengambil snapshot dari keadaan saat ini, mengubahnya menjadi string JSON, dan mendorongnya ke tumpukan `history`. Ini akan memotong riwayat masa depan jika snapshot baru diambil setelah operasi `undo`.
  - `undo(callback: (state: FlowElement[]) => void)`: Memindahkan `historyIndex` ke belakang, mengambil snapshot sebelumnya, mem-parsingnya, dan memanggil `callback` dengan keadaan yang telah dipulihkan.
  - `redo(callback: (state: FlowElement[]) => void)`: Memindahkan `historyIndex` ke depan dan melakukan hal yang sama.
  - `canUndo`: Properti `computed` yang mengembalikan `true` jika ada riwayat untuk dibatalkan.
  - `canRedo`: Properti `computed` yang mengembalikan `true` jika ada riwayat untuk diulangi.

### 2. [MODIFIKASI] `WorkflowChart.vue`

**Lokasi:** `src/components/flow/WorkflowChart.vue`

- **Integrasi:**
  1. Impor dan inisialisasi `useEditorHistory`.
  2. Gunakan `watch` dengan `deep: true` pada `ref` `elements` untuk secara otomatis memanggil `takeSnapshot()` setiap kali ada perubahan. Gunakan `debounce` untuk mencegah pengambilan snapshot yang berlebihan (misalnya, saat node sedang di-drag).

  ```ts
  // Di dalam <script setup> dari WorkflowChart.vue
  import { watchDebounced } from '@vueuse/core'
  import { useEditorHistory } from '../../composables/useEditorHistory'

  const { elements } = useVueFlow() // atau ref lokal `elements`
  const { takeSnapshot, undo, redo, canUndo, canRedo, isRestoring } = useEditorHistory()

  // Ambil snapshot awal
  watchDebounced(
    elements,
    (newElements) => {
      if (!isRestoring.value) {
        takeSnapshot(newElements)
      }
    },
    { deep: true, debounce: 300 } // Debounce untuk menangkap akhir dari sebuah aksi
  )

  function handleUndo() {
    undo((restoredState) => {
      elements.value = restoredState
    })
  }

  function handleRedo() {
    redo((restoredState) => {
      elements.value = restoredState
    })
  }

  // Expose fungsi ini untuk dipanggil dari parent
  defineExpose({ ..., handleUndo, handleRedo, canUndo, canRedo })
  ```

### 3. [MODIFIKASI] `AppHeader.vue`

**Lokasi:** `src/components/layout/AppHeader.vue`

- **Tujuan:** Menambahkan tombol dan logika untuk memicu Undo/Redo.
- **Perubahan:**
  - Tambahkan dua tombol baru: "Undo" dan "Redo".
  - Gunakan binding dinamis pada atribut `disabled` tombol berdasarkan `canUndo` dan `canRedo` yang diekspos dari `WorkflowChart.vue`.
  - Saat diklik, tombol-tombol ini akan memanggil `handleUndo` dan `handleRedo` pada `ref` `WorkflowChart`.

### 4. [MODIFIKASI] `WorkflowEditorView.vue`

**Lokasi:** `src/components/layout/WorkflowEditorView.vue`

- **Tujuan:** Menghubungkan `AppHeader` dengan `WorkflowChart`.
- **Perubahan:**
  - Meneruskan `canUndo` dan `canRedo` dari `WorkflowChart` ke `AppHeader` sebagai *props*.
  - Meneruskan event klik dari `AppHeader` untuk memanggil metode `handleUndo`/`handleRedo` pada `WorkflowChart`.
  - Tambahkan event listener untuk `keydown` (`Ctrl+Z`, `Ctrl+Y`) pada level view untuk memicu fungsi yang sesuai.

---