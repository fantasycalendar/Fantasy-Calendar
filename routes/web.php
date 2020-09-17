<?php

use Illuminate\Http\Request;

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

Route::get('/', 'WelcomeController@welcome')->name('home');
Route::view('/welcome', 'welcome')->name('welcome');
Route::view('/whats-new', 'pages.whats-new')->name('whats-new');
Route::view('/changelog', 'pages.changelog')->name('changelog');
Route::view('/donate', 'pages.donate', ['title'=>'Support the site']);

Route::get('calendars/{calendar}/print', 'CalendarController@print')->name('calendars.print');
Route::get('calendars/{calendar}/export', 'CalendarController@export')->name('calendars.export');
Route::resource('calendars', 'CalendarController');

Auth::routes(['verify' => true]);
Route::get('/logout', 'Auth\LoginController@logout');

Route::get('/settings', 'SettingsController@index')->name('settings')->middleware('auth');
Route::post('/settings', 'SettingsController@update')->name('settings.update')->middleware('auth');

Route::get('/admin/loginas/{userid}', 'AdminController@loginas')->name('admin.loginas')->middleware('admin');

Route::redirect('/403', '/');

Route::view('/404', 'errors.404', [
    'title' => 'Calendar not found',
    'resource' => 'Calendar'
]);

Route::get('/{path}', 'CalendarController@legacy')->where(['url' => 'calendar.php|calendar']);

// Manual error page routes for the moment
