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
        if(Auth::check() && !App::environment('local')) {
            if (!Auth::user()->betaAccess() && !Auth::user()->migrated) {
                Auth::logout();
                abort(redirect('https://www.fantasy-calendar.com/'));
            }
        }

        return $next($request);
    }
}
