<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use App\User;

class CalendarAuth
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
        if(isset($_SESSION['user_id'])) {
            if (User::find($_SESSION['user_id'])->beta_authorised != 1) {
                abort(403, 'Your account is not BETA activated, sorry.');
            }

            Auth::loginUsingId($_SESSION['user_id']);            
        } else {
            Auth::logout();
        }

        return $next($request);
    }
}
