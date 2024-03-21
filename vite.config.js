import vuePlugin from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";
import fs from 'fs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import inject from "@rollup/plugin-inject";

let server = {
    host: '0.0.0.0',
    hmr: {
        host: 'fantasy-calendar.test'
    }
};

if (fs.existsSync('/home/axel/.valet/Certificates/fantasy-calendar.test.key')) {
    server.https = {
        key: fs.readFileSync('/home/axel/.valet/Certificates/fantasy-calendar.test.key'),
        cert: fs.readFileSync('/home/axel/.valet/Certificates/fantasy-calendar.test.crt'),
    };
}


export default defineConfig({
    server,
    plugins: [
        inject({
          include: '',
          $: 'jquery',
          jQuery: 'jquery',
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/js/**/*.js',
                    dest: 'js',
                },
                {
                    src: 'node_modules/trumbowyg/dist/ui/icons.svg',
                    dest: 'public/images'
                },
                {
                    src: 'node_modules/alpinejs/dist/cdn.js',
                    dest: 'public/js/vendor/alpine'
                },
                {
                    src: 'node_modules/simplebar/dist/simplebar.min.js',
                    dest: 'public/js/vendor/simplebar'
                },
                {
                    src: 'node_modules/simplebar/dist/simplebar.css',
                    dest: 'public/js/vendor/simplebar'
                },
                {
                    src: 'resources/webfonts/**/*',
                    dest: 'public/resources/webfonts'
                }
            ]
        }),
        laravel([
            "resources/js/app.js",
            "resources/js/app-tw.js",
            "resources/sass/app-tw.css",
            "resources/sass/app.scss",
            "resources/sass/app-dark.scss",
        ]),
        vuePlugin({
            template: {
                transformAssetUrls: {
                    // The Vue plugin will re-write asset URLs, when referenced
                    // in Single File Components, to point to the Laravel web
                    // server. Setting this to `null` allows the Laravel plugin
                    // to instead re-write asset URLs to point to the Vite
                    // server instead.
                    base: null,

                    // The Vue plugin will parse absolute URLs and treat them
                    // as absolute paths to files on disk. Setting this to
                    // `false` will leave absolute URLs un-touched so they can
                    // reference assets in the public directory as expected.
                    includeAbsolute: false,
                },
            },
        }),
        nodePolyfills(),
    ],
});
