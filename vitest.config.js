import { defineConfig, configDefaults } from 'vitest/config'
import { resolve } from "node:path";

export default defineConfig({
    test: {
        include:['resources/**/*.test.js'],
    },
    resolve: {
        alias: [{ find: "@", replacement: resolve(__dirname, "./resources/js") }]
    }
});
