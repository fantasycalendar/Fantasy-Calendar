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

Route::view('/', 'welcome')->name('home');
Route::get('/donate', function(){
    return view('pages.donate', [
        'title'=>'Support the site'
    ]);
});


// Calendar management
Route::get('calendars/{calendar}/print', 'CalendarController@print')->name('calendars.print');
Route::get('calendars/{calendar}/export', 'CalendarController@export')->name('calendars.export');
Route::resource('calendars', 'CalendarController');


// User auth
Auth::routes(['verify' => true]);

Route::get('/settings', 'SettingsController@index')->name('settings')->middleware('auth');
Route::post('/settings', 'SettingsController@update')->name('settings.update')->middleware('auth');

Route::get('/admin/loginas/{userid}', 'AdminController@loginas')->name('admin.loginas')->middleware('admin');

// Donation page [LEGACY]
Route::get('/donate', function(){
    return view('pages.donate', [
        'title'=>'Support the site'
    ]);
});

// Subscription management
Route::get('/subscription', 'SubscriptionController@subscribe')->name('subscription.subscribemonthly');
Route::post('/subscription-update', 'SubscriptionController@update')->name('subscription.update');

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

// Catch-all redirect to make sure old bookmarks and such work.
// TODO: Add a way to warn users that this will break some day.
// Despite telling everyone update their bookmarks, they won't.
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
