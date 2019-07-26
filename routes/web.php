<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@home')->name('home');


// Manual error page routes for the moment

Route::get('/403', function() {
    return redirect('/');
})->middleware('calendarauth');

Route::get('/404', function() {
    return view('errors.404', [
        'title' => 'Calendar not found',
        'resource' => 'Calendar'
    ]);
})->middleware('calendarauth');