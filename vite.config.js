import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        // ESTO ES LA MAGIA: Todo lo que vaya a /api se manda a Flask (puerto 3001)
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist'
    }
})
