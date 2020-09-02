<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ErrorsController extends Controller
{
    public function calendarUnavailable() {
        return view('errors.calendar_unavailable', [
            'title' => "That calendar is unavailable."
        ]);
    }
}
