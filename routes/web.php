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

Route::get('/test', function(){
//
//    return [
//        'LoggedIn' => Auth::check(),
//        'Payment Level' => Auth::user()->paymentLevel()
//    ];

    $calendar = App\Calendar::first();
    $user = App\User::find(3);

    return [
        'view' => $user->can('view', $calendar),
        'update' => $user->can('update', $calendar),
        'edit' => $user->can('edit', $calendar),
        'attach-event' => $user->can('attach-event', $calendar),
        'settings' => $calendar->static_data['settings']
    ];
});

Route::view('/', 'welcome')->name('home');
Route::get('/donate', function(){
    return view('pages.donate', [
        'title'=>'Support the site'
    ]);
});

Route::get('invite/accept', 'InviteController@accept')->name('invite.accept')->middleware(['auth']);
Route::get('invite/register', 'InviteController@register')->name('invite.register')->middleware(['register']);

// Calendar management
Route::get('calendars/{calendar}/print', 'CalendarController@print')->name('calendars.print');
Route::get('calendars/{calendar}/export', 'CalendarController@export')->name('calendars.export');
Route::resource('calendars', 'CalendarController');


// User auth
Auth::routes(['verify' => true]);

Route::get('/settings', 'SettingsController@index')->name('settings')->middleware('auth');
Route::post('/profile', 'SettingsController@update')->name('settings.update')->middleware('auth');

Route::get('/admin/loginas/{userid}', 'AdminController@loginas')->name('admin.loginas')->middleware('admin');

// Donation page [LEGACY]
Route::get('/donate', function(){
    return view('pages.donate', [
        'title'=>'Support the site'
    ]);
});



// Subscription management
// Pricing page
Route::get('/pricing', 'SubscriptionController@pricing')->name('subscription.pricing');

// List current subscription
Route::get('/subscription', 'SubscriptionController@index')->name('subscription.index');

// They want to subscribe!
Route::get('/subscription/subscribe/{level}/{interval}', 'SubscriptionController@subscribe')->name('subscription.subscribe');
Route::post('/subscription/subscribe', 'SubscriptionController@createsubscription')->name('subscription.create');

// They want to cancel =(
Route::get('/subscription/cancel', 'SubscriptionController@cancellation')->name('subscription.cancel');
Route::post('/subscription/cancel', 'SubscriptionController@cancel')->name('subscription.cancel');

// They want to resume! =)
Route::get('/subscription/resume/{level}', 'SubscriptionController@resume')->name('subscription.resume');

// They want to upgrade
Route::post('/subscription/update/{level}/{plan}', 'SubscriptionController@update')->name('subscription.update');

Route::post('pricing/coupon', 'SubscriptionController@coupon');

// User profile
Route::get('/profile', function() {
    $invoices = null;

    if (Auth::user()->hasStripeId()) {
        $invoices = Auth::user()->invoices();
    }

    return view('pages.profile', [
        'user' => Auth::user(),
        'subscription' => Auth::user()->subscriptions()->active()->first(),
        'invoices' => $invoices
    ]);
})->middleware('auth')->name('profile');

Route::get('/error/unavailable', 'ErrorsController@calendarUnavailable')->name('errors.calendar_unavailable');
// Manual error page routes for the moment
Route::get('/403', function() {
    return redirect('/');
})->name('error403');

Route::get('/404', function() {
    return view('errors.404', [
        'title' => 'Calendar not found',
        'resource' => 'Calendar'
    ]);
})->name('error404');

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
