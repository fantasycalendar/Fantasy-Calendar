<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Policy;

class PolicyController extends Controller
{
    public function view() {

        $tos = Policy::where("in_effect_at", "<=", now())->latest()->first();

        return view('pages.markdown', [
            'markdown' => $tos->markdown(),
        ]);
    }
}
