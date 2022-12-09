<?php

namespace App\Http\Middleware;

use App\Models\TrackedRequest;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

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
        if (array_key_exists('host', $referer) &&
            !$request->is('/api/*') &&
            !$request->is('/profile/') &&
            !str_contains(config('app.url'), Arr::get($referer, 'host'))) {
            parse_str($referer['query'] ?? "", $output);
            TrackedRequest::create([
                'domain' => Arr::get($referer, 'host'),
                'path' => Arr::get($referer, 'path', '/'),
                'parameters' => json_encode($output),
                'target' => $request->fullUrl()
            ]);
        }
        return $next($request);
    }
}
