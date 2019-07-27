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
        session($_SESSION);

        if(session()->has('user_id')) {
            if (User::find(session()->get('user_id'))->beta_authorised != 1) {
                abort(403, 'Your account is not BETA activated, sorry.');
            }

            Auth::loginUsingId(session()->get('user_id'));
        } else {
            Auth::logout();
        }

        return $next($request);
    }
}
