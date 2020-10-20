<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Agreement;

class AgreementController extends Controller
{

    private function get_agreement(){
        $tos = Agreement::where("in_effect_at", "<=", now())->latest()->first();

        return [
            'title' => "Terms of Service",
            'date' => sprintf("Last updated: %s", $tos->in_effect_at->format('jS \\of F, Y')),
            'markdown' => $tos->content
        ];
    }

    public function view() {
        return view('pages.markdown', $this->get_agreement());
    }

    public function accept() {
        return view('pages.accept-tos', $this->get_agreement());
    }

    public function agreement_accepted(request $request) {
        Auth::user()->acceptedAgreement();
        
        $intended = session('intended');
        session()->forget('intended');

        return redirect($intended);
    }
}
