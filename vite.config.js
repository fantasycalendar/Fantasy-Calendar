import {defineConfig} from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    plugins: [
        laravel([
            'resources/js/jquery.js',
            'resources/js/app.js',
            'resources/js/app-tw.js',
            'resources/sass/app.scss',
            'resources/sass/app-dark.scss',
            'resources/sass/app-tw.css',
        ])
    ],
});
