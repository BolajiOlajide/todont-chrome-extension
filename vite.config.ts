import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import Icons from 'unplugin-icons/vite'
import manifest from './manifest.json' // Node 14 & 16


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
    Icons({ compiler: 'vue3' }),
  ]
})
