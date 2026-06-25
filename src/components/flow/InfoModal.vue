<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="emit('update:modelValue', false)">
        <div class="modal-panel" @click.stop>
          <div class="modal-header">
            <div class="modal-header__left">
              <div class="modal-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div class="modal-title">Workflow Information</div>
            </div>
            <button class="modal-close" @click="emit('update:modelValue', false)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="info-section">
              <h4>📋 Terminologi Flowchart vs Vue Flow</h4>
              <p>Vue Flow menggunakan konsep node (kotak) dan edge (garis). Konsep tradisional diterjemahkan sebagai berikut:</p>
              <ul class="info-list">
                <li><span class="hl hl-process">Process (Kotak)</span> → Node <strong>COMMAND</strong> atau <strong>FUNCTION</strong>.</li>
                <li><span class="hl hl-decision">Decision (Ketupat)</span> → Tidak butuh kotak khusus! Logika cabang IF/ELSE ditangani via <strong>Tag Edge Label</strong> yang keluar dari Command Node.</li>
                <li><span class="hl hl-start">Start / End (Oval)</span> → Node yang paling awal (tanpa garis masuk) bertindak sebagai Start. Node terbawah bertindak sebagai End.</li>
              </ul>
            </div>

            <div class="info-section">
              <h4>💡 Tips Editor</h4>
              <ul class="info-list">
                <li><strong>Drag & Drop:</strong> Pindahkan garis (edge) ke titik (handle) manapun tanpa harus menghapusnya.</li>
                <li><strong>Edit Node:</strong> Double-click pada node untuk membuka popup edit, atau klik icon pensil saat di-hover.</li>
                <li><strong>Hapus Garis:</strong> Double-click pada garis untuk menghapusnya secara instan.</li>
                <li><strong>Auto Arrange:</strong> Klik tombol ✨ Auto Arrange untuk merapikan seluruh susunan node secara otomatis.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(5, 10, 20, 0.75); backdrop-filter: blur(6px);
  z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-panel {
  background: #0d1521; border: 1px solid #1e2d3d; border-radius: 16px; width: 100%; max-width: 500px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(56, 189, 248, 0.1); overflow: hidden;
}
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #1e2d3d; }
.modal-header__left { display: flex; align-items: center; gap: 12px; }
.modal-icon { width: 36px; height: 36px; border-radius: 10px; background: #102a40; color: #38bdf8; display: flex; align-items: center; justify-content: center; }
.modal-title { font-size: 15px; font-weight: 700; color: #e2e8f0; }
.modal-close { width: 32px; height: 32px; background: #1e2d3d; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; transition: all 0.2s; }
.modal-close:hover { background: #2d4060; color: #e2e8f0; }

.modal-body { padding: 24px 20px; display: flex; flex-direction: column; gap: 20px; }
.info-section h4 { margin: 0 0 10px 0; font-size: 13px; color: #e2e8f0; }
.info-section p { margin: 0 0 10px 0; font-size: 12px; color: #94a3b8; line-height: 1.5; }
.info-list { margin: 0; padding-left: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6; display: flex; flex-direction: column; gap: 8px; }
.info-list li strong { color: #e2e8f0; }

.hl { padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px; }
.hl-process { background: #00e5a020; color: #00e5a0; border: 1px solid #00e5a040; }
.hl-decision { background: #ff4d4d20; color: #ff4d4d; border: 1px solid #ff4d4d40; }
.hl-start { background: #a78bfa20; color: #a78bfa; border: 1px solid #a78bfa40; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-panel, .modal-fade-leave-active .modal-panel { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease; }
.modal-fade-enter-from .modal-panel { transform: scale(0.92) translateY(10px); opacity: 0; }
.modal-fade-leave-to .modal-panel { transform: scale(0.96) translateY(5px); opacity: 0; }
</style>
