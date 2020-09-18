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

    public function error404(Request $request) {
        if(request()->is('/calendars/*')) {
            return view('errors.404', [
                'title' => 'Calendar not found',
                'resource' => 'Calendar'
            ]);
        }

        return view('errors.404', [
            'title' => 'Page not found',
            'resources' => 'Page'
        ]);
    }

    public function error403() {
        return redirect('/');
    }
}
