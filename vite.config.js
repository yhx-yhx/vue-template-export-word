/*
 * @Author: yhx 2045399856@qq.com
 * @Date: 2024-05-23 09:05:27
 * @LastEditTime: 2024-05-25 22:32:45
 * @FilePath: \vue-template-export-word\vite.config.js
 * @Description:
 *
 */
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  return {
    plugins: [vue(), vueJsx(), VueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
