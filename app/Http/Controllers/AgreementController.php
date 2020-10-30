<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Agreement;
use GrahamCampbell\Markdown\Facades\Markdown;
use Arr;

class AgreementController extends Controller
{

    public function view() {

        $tos = Agreement::current();

        return view('pages.markdown',
            [
                'title' => "Terms and Conditions",
                'date' => sprintf("Effective date: %s", $tos->in_effect_at->format('jS \\of F, Y')),
                'version' => $tos->id,
                'markdown' => Markdown::convertToHtml($tos->content)
            ]
        );
    }

    public function show(Request $request) {

        $tos = Agreement::current();

        return view('pages.prompt-tos',
            [
                'title' => "Terms and Conditions",
                'date' => sprintf("Effective date: %s", $tos->in_effect_at->format('jS \\of F, Y')),
                'version' => $tos->id,
                'markdown' => Markdown::convertToHtml($tos->content),
                'intended' => $request->input('intended') ?? 'calendars'
            ]
        );
    }

    public function accept(Request $request) {
        if(!$request->has('policy_acceptance')){
            return redirect('prompt-tos');
        }

        Auth::user()->acceptAgreement();

        if($request->has('marketing_acceptance')){
            Auth::user()->setMarketingStatus();
        }

        return redirect($request->input('intended') ?? 'calendars');
    }
}
