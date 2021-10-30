<?php

use Illuminate\Http\Request;
use App\Http\Controllers\StripeController;
use Intervention\Image\Facades\Image;

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

Route::get('/embedtest/{calendar}', 'EmbedController@embedCalendar');

Route::get('/imagetest', function(){
    return view('pages.imagetest');
});

Route::get('/integrationtest', function(){
    return view('pages.integrationtest');
})->name("integrationtest");

Route::get('/', 'WelcomeController@welcome')->name('home');
Route::view('/welcome', 'welcome')->name('welcome');
Route::view('/whats-new', 'pages.whats-new')->name('whats-new');
Route::view('/changelog', 'pages.changelog')->name('changelog');
Route::view('/faq', 'pages.faq')->name('faq');
Route::view('/donate', 'pages.donate', ['title'=>'Support the site']);
Route::view('/discord-server', 'pages.discord-server', ['title' => 'Join Our Discord Server!'])->name('discord.server');
Route::view('/discord', 'pages.discord')->name('discord');
Route::get('/discord-announcement-acknowledge', 'WelcomeController@discord_announcement_acknowledge')->name('discord-announcement-acknowledge');
Route::get('/terms-and-conditions', 'AgreementController@view')->name('terms-and-conditions');
Route::get('/privacy-policy', 'PolicyController@view')->name('privacy-policy');
Route::get('/prompt-tos', 'AgreementController@show')->name('prompt-tos');

Route::middleware('auth')->group(function(){
    Route::get('/account-migrated', 'WelcomeController@account_migrated')->name('account-migrated');
    Route::get('/account-migrated-acknowledge', 'WelcomeController@account_migrated_acknowledge')->name('account-migrated-acknowledge');
    Route::get('/agreement-accepted', 'AgreementController@accept')->name('agreement-accepted');

    Route::view('/account-deletion-request', 'pages.account-deletion-request')->middleware(['account.deletion', 'agreement']);
    Route::post('/set-account-deletion', 'AccountDeletionController@set')->middleware(['account.deletion']);

    Route::get('/cancel-account-deletion', 'AccountDeletionController@cancel')->name('cancel-account-deletion')->middleware();
    Route::get('/account-deletion-warning', 'AccountDeletionController@warning')->name('account-deletion-warning')->middleware();
});


Route::prefix('marketing')->as('marketing.')->middleware('auth')->group(function(){
    Route::view('/manage-subscription/{user}', 'pages.unsubscribe-confirmation')->name('manage-subscription')->middleware('signed');
    Route::post('/unsubscribe', 'SettingsController@unsubscribeFromMarketing')->name('unsubscribe');
    Route::post('/resubscribe', 'SettingsController@resubscribeToMarketing')->name('resubscribe');
    Route::view('/subscription-updated', 'pages.subscription-updated')->name('subscription-updated');
});

Route::prefix('invite')->group(function(){
    Route::middleware(['auth', 'account.deletion', 'agreement'])->group(function(){
        Route::get('accept', 'InviteController@accept')->name('invite.accept');
        Route::get('reject', 'InviteController@showRejectConfirmation')->name('invite.reject-confirm');
        Route::post('reject', 'InviteController@reject')->name('invite.reject');
    });

    Route::get('register', 'InviteController@register')->name('invite.register')->middleware(['register', 'signed:relative']);
});


// Calendar management
Route::middleware(['account.deletion', 'agreement'])->group(function(){
    Route::group(['as' => 'calendars.', 'prefix' => 'calendars'], function(){
        Route::get('/{calendar}/print', 'CalendarController@print')->name('print');
        Route::get('/{calendar}/export', 'CalendarController@export')->name('export');
        Route::get('/{calendar}.{ext}', 'CalendarController@renderImage')->name('image');
    });

    Route::resource('calendars', 'CalendarController');
});


// User auth
Auth::routes(['verify' => true]);
Route::get('/logout', 'Auth\LoginController@logout');

Route::middleware('admin')->as('admin.')->prefix('admin')->group(function() {
    Route::get('/impersonate/{userid}', 'AdminController@impersonate')->name('impersonate');
    Route::get('/reverse_impersonate/', 'AdminController@reverseImpersonate')->name('reverse_impersonate');
});

// Pricing page
Route::get('/pricing', 'SubscriptionController@pricing')->name('subscription.pricing');

// Subscription management
Route::prefix('subscription')->as('subscription.')->middleware(['account.deletion', 'agreement'])->group(function(){
    Route::get('/', 'SubscriptionController@index')->name('index');
    Route::get('/subscribe/{level}/{interval}', 'SubscriptionController@subscribe')->name('subscribe');
    Route::post('/subscribe', 'SubscriptionController@createsubscription')->name('create');
    Route::get('/cancel', 'SubscriptionController@cancellation')->name('cancel');
    Route::post('/cancel', 'SubscriptionController@cancel')->name('cancelpost');
    Route::get('/resume', 'SubscriptionController@resume')->name('resume');
    Route::post('/update/{level}/{plan}', 'SubscriptionController@update')->name('update');
});

Route::post('pricing/coupon', 'SubscriptionController@coupon');

// Extended Stripe Webhook
Route::post(
    'stripe/webhook',
    [StripeController::class, 'handleWebhook']
);

// User profile
Route::prefix('profile')->middleware(['auth', 'account.deletion', 'agreement'])->group(function(){
    Route::get('/', 'SettingsController@profile')->name('profile');
    Route::post('/', 'SettingsController@update')->name('settings.update');
    Route::post('/password', 'SettingsController@updatePassword');
    Route::post('/email', 'SettingsController@requestUpdateEmail');
    Route::get('/update-email/{user}', 'SettingsController@updateEmail')->name('update.email');
});

Route::get('/error/unavailable', 'ErrorsController@calendarUnavailable')->name('errors.calendar_unavailable');
// Manual error page routes for the moment
Route::get('/403', 'ErrorsController@error403');
Route::get('/404', 'ErrorsController@error404');

Route::get('/{path}', 'CalendarController@legacy')->where(['url' => 'calendar.php|calendar']);
Route::get('{path}', 'ErrorsController@error404');
