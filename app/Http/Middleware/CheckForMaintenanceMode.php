<?php

namespace App\Http\Middleware;

use Cache;
use Closure;
use Illuminate\Foundation\Http\Exceptions\MaintenanceModeException;
use Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode as Middleware;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckForMaintenanceMode extends Middleware
{
    /**
     * The URIs that should be reachable while maintenance mode is enabled.
     *
     * @var array
     */
    protected $except = [
        //
    ];

    /**
     * Handle an incoming request.
     *
     * If the application is in maintenance mode, we retrieve the payload from the cache containing
     * the user set message and time to display on the error page when the MaintenanceModeException
     * is thrown.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this->app->isDownForMaintenance()) {
            $data = json_decode(Cache::get(config('app.maintenance_key')), true);

            if (isset($data['secret']) && $request->path() === $data['secret']) {
                return $this->bypassResponse($data['secret']);
            }

            if ($this->hasValidBypassCookie($request, $data) ||
                $this->inExceptArray($request)) {
                return $next($request);
            }

            if (isset($data['redirect'])) {
                $path = $data['redirect'] === '/'
                    ? $data['redirect']
                    : trim($data['redirect'], '/');

                if ($request->path() !== $path) {
                    return redirect($path);
                }
            }

            if (isset($data['template'])) {
                return response(
                    $data['template'],
                    $data['status'] ?? 503,
                    isset($data['retry']) ? ['Retry-After' => $data['retry']] : []
                );
            }

            throw new HttpException(
                $data['status'] ?? 503,
                $data['message'],
                null,
                isset($data['retry']) ? ['Retry-After' => $data['retry']] : []
            );
        }

        return $next($request);
    }
}
