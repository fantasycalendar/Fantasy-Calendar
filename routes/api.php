<?php

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

Route::any('/user/login', 'Api\UserController@authenticate');
Route::middleware('auth:api')->get('/user', 'Api\UserController@user');

Route::any('/calendar/{calendar}/clone', 'Api\CalendarController@clone');
Route::any('/calendar/{calendar}/owned', 'Api\CalendarController@owned');
Route::any('/calendar/{calendar}/users', 'Api\CalendarController@users');
Route::any('/calendar/{calendar}/inviteUser', 'Api\CalendarController@inviteUser');
Route::any('/calendar/{calendar}/removeUser', 'Api\CalendarController@removeUser');
Route::any('/calendar/{calendar}/resend_invite', 'Api\CalendarController@resend_invite');
Route::any('/calendar/{calendar}/changeUserRole', 'Api\CalendarController@changeUserRole');
Route::any('/calendar/{calendar}/children', 'Api\CalendarController@children');
Route::any('/calendar/{calendar}/last_changed', 'Api\CalendarController@last_changed');
Route::any('/calendar/{calendar}/dynamic_data', 'Api\CalendarController@dynamic_data');
Route::any('/calendar/{calendar}/changeDate', 'Api\CalendarController@changeDate');
Route::apiResource('calendar', 'Api\CalendarController');


Route::apiResource('eventcategory', 'Api\EventCategoryController');

Route::any('/eventcomment/event/{id}', 'Api\EventCommentController@forEvent');
Route::any('/eventcomment/calendar/{id}', 'Api\EventCommentController@forCalendar');
Route::apiResource('eventcomment', 'Api\EventCommentController');

Route::apiResource('event', 'Api\CalendarEventController');

Route::get('presets', Api\PresetController::class.'@list');
Route::get('preset/{id}', Api\PresetController::class.'@show');
Route::get('presets.html', Api\PresetController::class.'@listHtml');

Route::prefix('render/{calendar}')->group(function() {
    Route::get('/month/{year?}/{month?}/{day?}', Api\CalendarRendererController::class.'@month');
});
