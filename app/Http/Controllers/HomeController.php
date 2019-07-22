<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use GrahamCampbell\Markdown\Facades\Markdown;

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
    
        $changelog = Markdown::convertToHtml(Storage::disk('base')->get('public/changelog.txt'));

        $calendars = (Auth::check()) ? Auth::user()->calendars : NULL;

        return view('home', [
            'title' => "Fantasy Calendar",
            'changelog' => $changelog,
            'calendars' => $calendars
        ]);
    }
}
