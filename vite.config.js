import { defineConfig } from 'vite'

export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/2023-Agricultural-Products-Price-Comparison/' : '/',
});
