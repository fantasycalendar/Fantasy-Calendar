<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequirePremium
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if(!Auth::check() && !Auth::user()->isPremium()) {
            return redirect(route('subscription.pricing'))->with('alert', "Thanks for using Fantasy Calendar! The feature you're trying to use requires a premium subscription.");
        }

        return $next($request);
    }
}
