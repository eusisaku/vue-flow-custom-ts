import { createApp } from 'vue'
import App from './App.vue'

// Import Vue-Flow dengan named imports
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

// Import styles
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

// Import custom styles
import './styles/flow.css'

const app = createApp(App)

// Register komponen global
app.component('VueFlow', VueFlow)
app.component('Background', Background)
app.component('Controls', Controls)
app.component('MiniMap', MiniMap)

app.mount('#app')
