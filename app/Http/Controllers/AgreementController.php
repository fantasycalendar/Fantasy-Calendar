<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Agreement;

class AgreementController extends Controller
{
    public function view() {

        $tos = Agreement::where("in_effect_at", "<=", now())->latest()->first();

        return view('pages.markdown', [
            'markdown' => $tos->markdown(),
        ]);
    }
}
