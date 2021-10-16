<?php

namespace App\Http\Middleware;

use App\TrackedRequest;
use Closure;
use Illuminate\Http\Request;

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
        $referer = parse_url($request->header('referer'));
        if (isset($referer['host']) &&
            !$request->is('/api/*') &&
            !$request->is('/profile/') &&
            !str_contains(config('app.url'), $referer['host'])) {
            parse_str($referer['query'] ?? "", $output);
            TrackedRequest::create([
                'domain' => $referer['host'],
                'path' => $referer['path'],
                'parameters' => json_encode($output),
                'target' => $request->fullUrl()
            ]);
        }
        return $next($request);
    }
}
