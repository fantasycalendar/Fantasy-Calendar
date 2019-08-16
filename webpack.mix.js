const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.copyDirectory('resources/js/calendar', 'public/js/calendar');
mix.copyDirectory('resources/js/components', 'public/js/components');
mix.copyDirectory('resources/js/vendor', 'public/js/vendor');
mix.copyDirectory('resources/js/webworkers', 'public/js/webworkers');

mix.js('resources/js/app.js', 'public/js')

    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/calendar_input_style.scss', 'public/css')
    .sass('resources/sass/calendar_styles.scss', 'public/css')
    .sass('resources/sass/header_style.scss', 'public/css')
    .sass('resources/sass/index_style.scss', 'public/css')
    .sass('resources/sass/login_style.scss', 'public/css')
    .sass('resources/sass/text_styles.scss', 'public/css')
    .sass('resources/sass/_variables.scss', 'public/css');
