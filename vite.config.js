/*
 * @Author: yhx 2045399856@qq.com
 * @Date: 2024-05-23 09:05:27
 * @LastEditTime: 2024-05-26 00:17:48
 * @FilePath: \vue-template-export-word\vite.config.js
 * @Description:
 *
 */
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_BASE_API } = env
  console.log(VITE_APP_BASE_API)
  return {
    base: VITE_APP_BASE_API,
    plugins: [vue(), vueJsx(), VueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
