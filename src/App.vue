<template>
  <div id="app">
    <WorkflowCatalogView
      v-if="currentView === 'catalog'"
      @open-editor="openEditor"
    />
    <WorkflowEditorView
      v-else-if="currentView === 'editor'"
      :initial-catalog-id="selectedCatalogId"
      @close-editor="closeEditor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AppView } from './types'
import WorkflowCatalogView from './components/layout/WorkflowCatalogView.vue'
import WorkflowEditorView from './components/layout/WorkflowEditorView.vue'

const currentView = ref<AppView>('catalog')
const selectedCatalogId = ref<string | null>(null)

function openEditor(catalogId: string): void {
  selectedCatalogId.value = catalogId
  currentView.value = 'editor'
}

function closeEditor(): void {
  currentView.value = 'catalog'
  selectedCatalogId.value = null
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --sidebar-w: 240px;
  --header-h: 52px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
  background: #050f1e;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #e2e8f0;
}

#app {
  height: 100vh;
}

/* Dark scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #0d1521;
}
::-webkit-scrollbar-thumb {
  background: #1e2d3d;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #06b6d4;
}
</style>
