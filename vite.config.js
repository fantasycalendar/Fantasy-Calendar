import {defineConfig, loadEnv} from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const appUrl = env.APP_URL || 'http://localhost:9980';
    const hmrHost = new URL(appUrl).hostname;
    const hmrPort = parseInt(env.FORWARD_VITE_PORT || '5173');

    return {
        server: {
            host: '0.0.0.0',
            cors: true,
            allowedHosts: ['npm'],
            hmr: {
                host: hmrHost,
                clientPort: hmrPort,
            }
        },
        plugins: [
            laravel([
                'resources/js/app.js',
                'resources/js/app-tw.js',
                'resources/sass/app.scss',
                'resources/sass/app-tw.css',
            ])
        ],

    };
});
