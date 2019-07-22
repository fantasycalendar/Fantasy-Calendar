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
            Auth::loginUsingId($_SESSION['user_id']);
        } else {
            Auth::logout();
        }

        return $next($request);
    }
}
