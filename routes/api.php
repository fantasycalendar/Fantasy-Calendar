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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::any('/calendar/owned', 'Api\CalendarController@owned');
Route::any('/calendar/{id}', 'Api\CalendarController@get');
Route::any('/calendar/{id}/children', 'Api\CalendarController@children');
Route::any('/calendar/{id}/last_changed', 'Api\CalendarController@last_changed');
Route::any('/calendar/{id}/dynamic_data', 'Api\CalendarController@dynamic_data');
Route::any('/calendar/{id}/delete', 'Api\CalendarController@delete');

Route::apiResource('eventcategory', 'Api\EventCategoryController');

Route::apiResource('eventcomment', 'Api\EventCommentController');
Route::any('/eventcomment/event/{id}', 'Api\EventCommentController@forEvent');
Route::any('/eventcomment/calendar/{id}', 'Api\EventCommentController@forCalendar');

Route::fallback(function(){
    return response()->json([
        'message' => 'Page Not Found.'], 404);
});