<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function user (Request $request)
    {
        return $request->user();
    }

    public function authenticate(Request $request)
    {
        $login = request()->input('identity');

        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        request()->merge([$field => $login]);

        if(Auth::once($request->only([$field, 'password']))) {
            return [
                'username' => Auth::user()->username,
                'api_token' => Auth::user()->api_token,
            ];
        }

        return response([
            'error' => 'Those credentials do not match our records.'
        ], 401);
    }
}
