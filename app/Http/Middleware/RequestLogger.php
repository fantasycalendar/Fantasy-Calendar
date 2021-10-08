<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RequestLogger
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

        if(!$request->is('/api/*') &&
            !$request->is('/profile/') &&
            !$request->getHost() !== config('app.url')){
            DB::table('requests')->insert([
                'domain' => $request->getHost(),
                'path' => $request->path(),
                'parameters' => json_encode($request->all())
            ]);
        }
        return $next($request);
    }
}
