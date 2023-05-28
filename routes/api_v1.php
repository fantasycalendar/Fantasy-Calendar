<?php

use App\Http\Controllers\Api\V1\CalendarController;
use App\Http\Controllers\Api\V1\CalendarEventController;
use App\Http\Controllers\Api\V1\CalendarRendererController;
use App\Http\Controllers\Api\V1\EventCategoryController;
use App\Http\Controllers\Api\V1\EventCommentController;
use App\Http\Controllers\Api\V1\PresetController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Routes that are _technically_ API but shouldn't require authentication
Route::any('/user/login', [UserController::class, 'authenticate']);
Route::any('/calendar/{calendar}/children', [CalendarController::class, 'children']);
Route::any('/calendar/{calendar}/last_changed', [CalendarController::class, 'last_changed']);
Route::any('/calendar/{calendar}/dynamic_data', [CalendarController::class, 'dynamic_data']);
Route::any('/eventcomment/event/{id}', [EventCommentController::class, 'forEvent']);
Route::any('/eventcomment/calendar/{id}', [EventCommentController::class, 'forCalendar']);
Route::apiResources(
    ['calendar' => CalendarController::class, 'eventcomment' => EventCommentController::class],
    ['only' => 'show']
);

Route::get('presets', [PresetController::class, 'list']);
Route::get('preset/{id}', [PresetController::class, 'show']);
Route::get('presets.html', [PresetController::class, 'listHtml']);

Route::any('/calendar/{calendar}/core', [CalendarController::class, 'core']);

// Any routes in here require authentication
Route::middleware(['auth:sanctum'])->group(function () {
    Route::any('/user', [UserController::class, 'user']);

    Route::any('/calendar/{calendar}/clone', [CalendarController::class, 'clone']);
    Route::any('/calendar/{calendar}/owned', [CalendarController::class, 'owned']);
    Route::any('/calendar/{calendar}/users', [CalendarController::class, 'users']);
    Route::any('/calendar/{calendar}/inviteUser', [CalendarController::class, 'inviteUser']);
    Route::any('/calendar/{calendar}/removeUser', [CalendarController::class, 'removeUser']);
    Route::any('/calendar/{calendar}/resend_invite', [CalendarController::class, 'resend_invite']);
    Route::any('/calendar/{calendar}/changeUserRole', [CalendarController::class, 'changeUserRole']);
    Route::any('/calendar/{calendar}/changeDate', [CalendarController::class, 'changeDate']);
    Route::any('/calendar/{calendar}/getCurrentDate', [CalendarController::class, 'getCurrentDate']);
    Route::apiResources(
        ['calendar' => CalendarController::class, 'eventcomment' => EventCommentController::class],
        ['except' => 'show']
    );
    Route::apiResources([
        'eventcategory' => EventCategoryController::class,
        'event' => CalendarEventController::class,
    ]);

    Route::prefix('render/{calendar}')->group(function () {
        Route::get('/month/{year?}/{month?}/{day?}', [CalendarRendererController::class, 'month']);
    });
});
