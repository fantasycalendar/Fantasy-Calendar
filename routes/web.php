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

route::get('/test', function(){
    ddd(\App\OldCalendar::first()->user);
});

Route::view('/', 'welcome')->name('home');
Route::get('/donate', function(){
    return view('pages.donate', [
        'title'=>'Support the site'
    ]);
});

Route::get('calendars/{calendar}/print', 'CalendarController@print')->name('calendars.print');
Route::get('calendars/{calendar}/export', 'CalendarController@export')->name('calendars.export');
Route::resource('calendars', 'CalendarController');

Auth::routes(['verify' => true]);

Route::get('/settings', 'SettingsController@index')->name('settings')->middleware('auth');
Route::post('/settings', 'SettingsController@update')->name('settings.update')->middleware('auth');

Route::get('/admin/loginas/{userid}', 'AdminController@loginas')->name('admin.loginas')->middleware('admin');

Route::get('/{path}', function(Request $request) {
    if($request->get('action') == 'generate') {
        return redirect('calendars/create');
    }

    if($request->get('action') == 'view') {
        return redirect("calendars/{$request->get('id')}");
    }

    if($request->get('action') == 'edit') {
        return redirect("calendars/{$request->get('id')}/edit");
    }
})->where(['url' => 'calendar.php|calendar']);

// Manual error page routes for the moment

Route::get('/403', function() {
    return redirect('/');
});

Route::get('/404', function() {
    return view('errors.404', [
        'title' => 'Calendar not found',
        'resource' => 'Calendar'
    ]);
});
