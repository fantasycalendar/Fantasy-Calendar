<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;

class FantasyCalendarRememberLogin
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
        if(!Auth::check() && Cookie::has('fantasycalendar_remember')) {
//            dump(urldecode(Cookie::get('fantasycalendar_remember')));
            list($user_id, $selector, $authenticator) = explode(':', urldecode(Cookie::get('fantasycalendar_remember')));

            $result = DB::table('auth_tokens')
                ->select(DB::raw('id, user_id, token, expires'))
                ->where('selector', $selector);

            if($result->count()){
                $row = $result->first();
                if(hash_equals($row->token, hash('sha256', base64_decode($authenticator)))) {
                    if($user_id == $row->user_id) {
                        Auth::loginUsingId($user_id, true);
                    }
                }
            }
        }

        return $next($request);
    }
}
