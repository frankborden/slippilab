import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  assetsInclude: /.*zip$/,
  plugins: [solidPlugin()]
})
