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
        if(!Arr::has($request->all(), 'policy_acceptance')){
            return redirect('pages.prompt-tos');
        }

        Auth::user()->acceptAgreement();

        if(Arr::has($request->all(), 'marketing_acceptance')){
            Auth::user()->setMarketingStatus(true);     // We're not passing false here, as we're not opting out
        }

        return redirect($request->input('intended') ?? 'calendars');
    }
}
