<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use database;
use Auth;
use Storage;
use App\User;

class HomeController extends Controller
{
    public function home() {    
        if(isset($_SESSION['user_id'])) {
            Auth::login(User::find($_SESSION['user_id']));
        }
    
        $changelog = Storage::disk('base')->get('public/changelog.txt');
        $changelog = preg_replace( "/###[ ]?([A-Z0-9\.]+): ([A-Z0-9 ,]+)/i", "<h3>$1</h3>" . PHP_EOL . "<i>$2</i>" . PHP_EOL . "<ul>", $changelog );
        $changelog = preg_replace( "/\* ([A-Z0-9 !\._,'\(\)\/\-&\"\']+)/i", "<li>$1</li>", $changelog );
        $changelog = preg_replace( "/" . PHP_EOL . "<h3>/i", "</ul>" . PHP_EOL . PHP_EOL . "<h3>", $changelog );
        $changelog .= PHP_EOL . "</ul>";

        $calendars = (Auth::check()) ? Auth::user()->calendars : NULL;

        return view('home', [
            'title' => "Fantasy Calendar",
            'changelog' => $changelog,
            'calendars' => $calendars
        ]);
    }
}
