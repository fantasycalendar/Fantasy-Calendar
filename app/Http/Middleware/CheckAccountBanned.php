<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;

class CheckAccountBanned
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->isBanned()) {
            return response()->view('pages.account-banned', [
                'user' => Auth::user(),
                'banned_reason' => Auth::user()->bannedReason()
            ]);
        }
        return $next($request);
    }
}
