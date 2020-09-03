<?php

namespace App\Http\Middleware;

use Arr;
use Closure;
use Illuminate\Routing\Exceptions\InvalidSignatureException;
use Illuminate\Routing\UrlGenerator;
use URL;

class ValidateRelativeSignedUrl
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $relative = null)
    {
        if (URL::hasValidSignature($request, $relative !== 'relative')) {
            return $next($request);
        }

        throw new InvalidSignatureException;
    }
}
