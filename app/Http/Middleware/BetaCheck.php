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
        if(Auth::check() && env('APP_ENV') == 'production') {
            if (!Auth::user()->betaAccess() && !Auth::user()->migrated) {
                Auth::logout();
                abort(redirect('https://www.fantasy-calendar.com/'));
            }
        }

        return $next($request);
    }
}
