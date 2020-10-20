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

    public function show(Request $request) {
        return view('pages.prompt-tos', array_merge(
            $this->get_agreement(),
            ['intended' => $request->input('intended') ?? 'calendars']
        ));
    }

    public function agreement_accepted(Request $request) {
        Auth::user()->acceptAgreement();

        return redirect($request->input('intended') ?? 'calendars');
    }
}
