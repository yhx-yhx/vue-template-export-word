/*
 * @Author: yhx 2045399856@qq.com
 * @Date: 2024-05-23 09:05:27
 * @LastEditTime: 2024-05-25 22:22:18
 * @FilePath: \vue-template-export-word\vite.config.js
 * @Description:
 *
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
const baseUrl = import.meta.env.VITE_APP_BASE_API

// https://vitejs.dev/config/
export default defineConfig({
  base: baseUrl,
  plugins: [vue(), vueJsx(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
