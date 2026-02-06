import {defineConfig} from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        }
    },
    plugins: [
        laravel([
            'resources/js/app.js',
            'resources/js/app-tw.js',
            'resources/sass/app.scss',
            'resources/sass/app-dark.scss',
            'resources/sass/app-tw.css',
        ])
    ],
});
