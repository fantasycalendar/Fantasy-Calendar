<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function(){
    Route::get('/calendars', [\App\Http\Controllers\CalendarController::class, 'index'])
        ->name('calendars');
    Route::get('/calendars/{calendar}', [\App\Http\Controllers\CalendarController::class, 'show'])
        ->name('calendars.show');
    Route::get('profile', [\App\Http\Controllers\ProfileController::class, 'profile'])
        ->name('profile');
});


require __DIR__.'/auth.php';
