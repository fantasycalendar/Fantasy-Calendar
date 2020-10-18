<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Agreement;

class AgreementController extends Controller
{
    public function view() {

        $tos = Agreement::where("in_effect_at", "<=", now())->latest()->first();

        return view('pages.markdown', [
            'title' => "Terms of Service",
            'date' => sprintf("Last updated: %s", $tos->in_effect_at->format('jS \\of F, Y')),
            'markdown' => $tos->content
        ]);
    }

    public function accept() {

        $tos = Agreement::where("in_effect_at", "<=", now())->latest()->first();

        return view('pages.accept-tos', [
            'title' => "Terms of Service",
            'date' => sprintf("Last updated: %s", $tos->in_effect_at->format('jS \\of F, Y')),
            'markdown' => $tos->content
        ]);
    }

    public function agreement_accepted() {

        Auth::user()->acceptedAgreement();

        return redirect(route('calendars.index'));

    }
}
