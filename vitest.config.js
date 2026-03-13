import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['resources/js/__tests__/**/*.test.js'],
    },
});
