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

if(process.env.BROWSERSYNC) {
    mix.browserSync({
        proxy: 'fantasy-calendar:8080',
        port: 9980,
        open: false,
        snippetOptions: {
            rule: {
                match: /<\/body>/i,
                fn: function(snippet, match) {
                    return snippet + match;
                }
            }
        }
    });
}

// Copy components and vendor scripts
mix.copyDirectory('resources/js/components', 'public/js/components');
mix.copyDirectory('resources/js/vendor', 'public/js/vendor');
mix.copyDirectory('resources/images', 'public/resources');

// Calendar scripts
mix.copy('resources/js/calendar/header.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_ajax_functions.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_event_ui.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_functions.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_variables.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_weather_layout.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_season_generator.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_layout_builder.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_inputs_visitor.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_inputs_view.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_inputs_edit.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_manager.js', 'public/js/calendar');
mix.copy('resources/js/calendar/calendar_presets.js', 'public/js/calendar');

// Webworkers
mix.copy('resources/js/webworkers/worker_calendar.js', 'public/js/webworkers');
mix.copy('resources/js/webworkers/worker_climate.js', 'public/js/webworkers');
mix.copy('resources/js/webworkers/worker_events.js', 'public/js/webworkers');

// Misc
mix.copy('resources/js/login.js', 'public/js');

// Vendor
mix.copy('node_modules/trumbowyg/dist/ui/icons.svg', 'public/images');

// Compiled assets
mix.js('resources/js/app.js', 'public/js')

    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/app-dark.scss', 'public/css');

if (mix.inProduction() || process.env.MIXVERSION) {
    mix.version();
}
