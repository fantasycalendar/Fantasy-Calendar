<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use App\User;

class BetaCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(Auth::check()) {
            if (!Auth::user()->betaAccess()) {
//                abort(403, 'Your account is not BETA activated, sorry.');
            }
        }

        return $next($request);
    }
}
