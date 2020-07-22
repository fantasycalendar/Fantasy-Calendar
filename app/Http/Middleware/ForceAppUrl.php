<?php

namespace App\Http\Middleware;

use Closure;

class ForceAppUrl
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
        $_SERVER['HTTP_HOST'] = config('app.url');
        $_SERVER['SERVER_NAME'] = config('app.url');

        return $next($request);
    }
}
