<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Calendar;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware('auth:api');
    }

    public function get(Request $request, $id) {
        return Calendar::active()->where([
            ['user_id', '=', $request->user()->id],
            ['hash', '=', $id]
        ])->firstOrFail();
    }

    public function children(Request $request, $id) {
        return Calendar::active()->where([
            ['user_id', '=', $request->user()->id],
            ['hash', '=', $id]
        ])->firstOrFail()->children;
    }

    public function last_changed(Request $request, $id) {
        $calendar = Calendar::active()->where([
            ['user_id', '=', $request->user()->id],
            ['hash', '=', $id]
        ])->firstOrFail();

        $last_changed = [
            'last_dynamic_change' => $calendar->last_dynamic_change,
            'last_static_change' => $calendar->last_static_change,
        ];

        return $last_changed;
    }

    public function delete(Request $request, $id) {
        return Calendar::active()->where([
            ['user_id', '=', $request->user()->id],
            ['hash', '=', $id]
        ])->delete();
    }
}
