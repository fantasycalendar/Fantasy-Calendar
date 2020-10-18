<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Agreement;
use App\User;

class AgreementController extends Controller
{
    public function view() {

        $tos = Agreement::where("in_effect_at", "<=", now())->latest()->first();

        return view('pages.terms-of-service', [
            'markdown' => $tos->markdown(),
        ]);
    }
}
