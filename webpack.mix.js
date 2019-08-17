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
        open: false
    });
}

// Copy components and vendor scripts
mix.copyDirectory('resources/js/components', 'public/js/components');
mix.copyDirectory('resources/js/vendor', 'public/js/vendor');

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

// Compiled assets
mix.js('resources/js/app.js', 'public/js')

    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/calendar_input_style.scss', 'public/css')
    .sass('resources/sass/calendar_styles.scss', 'public/css')
    .sass('resources/sass/header_style.scss', 'public/css')
    .sass('resources/sass/index_style.scss', 'public/css')
    .sass('resources/sass/login_style.scss', 'public/css')
    .sass('resources/sass/text_styles.scss', 'public/css')
    .sass('resources/sass/_variables.scss', 'public/css');

mix.version();
