<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Policy;
use League\CommonMark\GithubFlavoredMarkdownConverter;

class PolicyController extends Controller
{
    public function view() {

        $policy = Policy::current();

        return view('pages.markdown', [
            'title' => "Privacy and Cookies Policy",
            'date' => sprintf("Effective date: %s", $policy->in_effect_at->format('jS \\of F, Y')),
            'version' => $policy->id,
            'markdown' => (new GithubFlavoredMarkdownConverter())->convert($policy->content),
        ]);
    }
}
