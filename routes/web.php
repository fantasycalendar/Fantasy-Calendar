<?php

use App\Http\Controllers\AccountDeletionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgreementController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\EmbedController;
use App\Http\Controllers\ErrorsController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WelcomeController;
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

Route::get('/embed/{calendar}', [EmbedController::class, 'embedCalendar'])->middleware('can:embedAny,App\Models\Calendar');

Route::get('/', [WelcomeController::class, 'welcome'])->name('home');
Route::view('/welcome', 'welcome')->name('welcome');
Route::view('/changelog', 'pages.changelog')->name('changelog');
Route::view('/faq', 'pages.faq')->name('faq');
Route::view('/donate', 'pages.donate', ['title'=>'Support the site']);
Route::view('/discord-server', 'pages.discord-server', ['title' => 'Join Our Discord Server!'])->name('discord.server');
Route::view('/discord', 'pages.discord')->name('discord');
Route::get('/discord-announcement-acknowledge', [WelcomeController::class, 'discord_announcement_acknowledge'])->name('discord-announcement-acknowledge');
Route::get('/terms-and-conditions', [AgreementController::class, 'view'])->name('terms-and-conditions');
Route::get('/privacy-policy', [PolicyController::class, 'view'])->name('privacy-policy');
Route::get('/prompt-tos', [AgreementController::class, 'show'])->name('prompt-tos');

Route::middleware('auth')->group(function(){
    Route::get('/account-migrated', fn() => redirect(route('account-migrated-acknowledge')))->name('account-migrated');
    Route::get('/account-migrated-acknowledge', [WelcomeController::class, 'account_migrated_acknowledge'])->name('account-migrated-acknowledge');
    Route::get('/agreement-accepted', [AgreementController::class, 'accept'])->name('agreement-accepted');

    Route::view('/account-deletion-request', 'pages.account-deletion-request')->middleware(['account.deletion', 'agreement'])->name('account-deletion-request');
    Route::post('/set-account-deletion', [AccountDeletionController::class, 'set'])->middleware(['account.deletion']);

    Route::get('/cancel-account-deletion', [AccountDeletionController::class, 'cancel'])->name('cancel-account-deletion')->middleware();
    Route::get('/account-deletion-warning', [AccountDeletionController::class, 'warning'])->name('account-deletion-warning')->middleware();
});


Route::prefix('marketing')->as('marketing.')->middleware('auth')->group(function(){
    Route::view('/manage-subscription/{user}', 'pages.unsubscribe-confirmation')->name('manage-subscription')->middleware('signed');
    Route::post('/unsubscribe', [SettingsController::class, 'unsubscribeFromMarketing'])->name('unsubscribe');
    Route::post('/resubscribe', [SettingsController::class, 'resubscribeToMarketing'])->name('resubscribe');
    Route::view('/subscription-updated', 'pages.subscription-updated')->name('subscription-updated');
});

Route::prefix('invite')->group(function(){
    Route::middleware(['auth', 'account.deletion', 'agreement'])->group(function(){
        Route::get('accept', [InviteController::class, 'accept'])->name('invite.accept');
        Route::get('reject', [InviteController::class, 'showRejectConfirmation'])->name('invite.reject-confirm');
        Route::post('reject', [InviteController::class, 'reject'])->name('invite.reject');
    });

    Route::get('register', [InviteController::class, 'register'])->name('invite.register')->middleware(['register', 'signed:relative']);
});


// Calendar management
Route::middleware(['account.deletion', 'agreement'])->group(function(){
    Route::group(['as' => 'calendars.', 'prefix' => 'calendars'], function(){
        Route::get('/{calendar}/guided_embed', [CalendarController::class, 'guidedEmbed'])->name('guided_embed')->middleware('can:embedAny,App\Models\Calendar');
        Route::get('/{calendar}/export', [CalendarController::class, 'export'])->name('export');
        Route::get('/{calendar}.{ext}', [CalendarController::class, 'renderImage'])->name('image')->middleware('feature:imagerenderer');
    });

    Route::resource('calendars', CalendarController::class);
});


// User auth
Auth::routes(['verify' => true]);
Route::get('/logout', [LoginController::class, 'logout']);

Route::middleware('admin')->as('admin.')->prefix('admin')->group(function() {
    Route::get('/impersonate/{userid}', [AdminController::class, 'impersonate'])->name('impersonate');
    Route::get('/reverse_impersonate/', [AdminController::class, 'reverseImpersonate'])->name('reverse_impersonate');
});

// Pricing page
Route::get('/pricing', [SubscriptionController::class, 'pricing'])->name('subscription.pricing');

// Subscription management
Route::prefix('subscription')->as('subscription.')->middleware(['account.deletion', 'agreement', 'feature:stripe'])->group(function(){
    Route::get('/subscribe/{level}/{interval}', [SubscriptionController::class, 'subscribe'])->name('subscribe');
    Route::post('/subscribe', [SubscriptionController::class, 'createsubscription'])->name('create');
    Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
    Route::get('/resume', [SubscriptionController::class, 'resume'])->name('resume');
    Route::post('/update/{level}/{plan}', [SubscriptionController::class, 'update'])->name('update');
});

Route::post('pricing/coupon', [SubscriptionController::class, 'coupon']);

// Extended Stripe Webhook
Route::post(
    'stripe/webhook',
    [StripeController::class, 'handleWebhook']
);

// User profile
Route::prefix('profile')->middleware(['auth', 'account.deletion', 'agreement'])->group(function(){
    Route::view('/', 'profile.account')->name('profile');
    Route::get('/billing', [SettingsController::class, 'billing'])->name('profile.billing');
    Route::get('/billing-portal', [SettingsController::class, 'billingPortal'])->name('profile.billing-portal');
    Route::view('/integrations','profile.integrations')->name('profile.integrations');
    Route::get('/update-email/{user}', [SettingsController::class, 'updateEmail'])->name('update.email')->middleware('signed');

    Route::get('/api-tokens', [SettingsController::class, 'apiTokens'])->name('profile.api-tokens')->middleware(['premium', 'can:interact,Laravel\Sanctum\PersonalAccessToken']);
    Route::post('/api-tokens/create', [SettingsController::class, 'createApiToken'])->name('profile.api-tokens.create')->middleware(['premium', 'can:interact,Laravel\Sanctum\PersonalAccessToken']);
    Route::delete('/api-tokens/delete/{personalAccessToken}', [SettingsController::class, 'deleteApiToken'])->name('profile.api-tokens.delete')->middleware(['premium', 'can:interact,Laravel\Sanctum\PersonalAccessToken']);

    Route::post('/settings', [SettingsController::class, 'updateSettings'])->name('profile.updateSettings');
    Route::post('/account', [SettingsController::class, 'updateAccount'])->name('profile.updateAccount');
});

Route::get('/error/unavailable', [ErrorsController::class, 'calendarUnavailable'])->name('errors.calendar_unavailable');
// Manual error page routes for the moment
Route::get('/403', [ErrorsController::class, 'error403']);
Route::get('/404', [ErrorsController::class, 'error404']);

Route::get('/{path}', [CalendarController::class, 'legacy'])->where(['url' => 'calendar.php|calendar']);
Route::get('{path}', [ErrorsController::class, 'error404']);
