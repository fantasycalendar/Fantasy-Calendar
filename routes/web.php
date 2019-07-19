<?php

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
    $changelog = file_get_contents(__DIR__ . '/../public/changelog.txt');
    $changelog = preg_replace( "/###[ ]?([A-Z0-9\.]+): ([A-Z0-9 ,]+)/i", "<h3>$1</h3>" . PHP_EOL . "<i>$2</i>" . PHP_EOL . "<ul>", $changelog );
    $changelog = preg_replace( "/\* ([A-Z0-9 !\._,'\(\)\/\-&\"\']+)/i", "<li>$1</li>", $changelog );
    $changelog = preg_replace( "/" . PHP_EOL . "<h3>/i", "</ul>" . PHP_EOL . PHP_EOL . "<h3>", $changelog );
    $changelog .= PHP_EOL . "</ul>";

    return view('home', [
        'title' => "Fantasy Calendar",
        'changelog' => $changelog,
        'calendars' => collect(App\Calendar::all())
    ]);
});