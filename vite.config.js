import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: mode === 'admin' 
      ? (env.VITE_BASE_ADMIN_PATH || '/LoginPanel') 
      : (env.VITE_BASE_PATH || '/portfolio')
  }
})
