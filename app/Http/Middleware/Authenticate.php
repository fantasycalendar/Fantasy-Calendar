<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (
            app()->environment(['local', 'development'])
            && config('app.dev_auth')
            && !auth()->check()
        ) {
            auth()->login(User::createDevUser());
        }

        if (!$request->expectsJson()) {
            return route('login');
        }
    }
}
