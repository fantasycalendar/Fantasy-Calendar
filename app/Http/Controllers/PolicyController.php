<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Policy;

class PolicyController extends Controller
{
    public function view() {

        $policy = Policy::current();

        return view('pages.markdown', [
            'title' => "GDPR Privacy Policy",
            'date' => sprintf("Last updated: %s", $policy->in_effect_at->format('jS \\of F, Y')),
            'markdown' => $policy->content
        ]);
    }
}
