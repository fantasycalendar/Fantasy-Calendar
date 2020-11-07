<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use App\User;
use Illuminate\Support\Facades\App;

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
        if(Auth::check() && App::environment('development')) {
            if(!Auth::user()->betaAccess()) {
                abort(403, "Your account is not beta authorized.");
            }
        }

        return $next($request);
    }
}
