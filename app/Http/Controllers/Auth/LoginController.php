<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/calendars';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * User username instead of email to login
     * 
     * @return string
     */
    public function username() {
        return 'username';
    }
    
    public function authenticated(Request $request, $user) {
        if($request->wantsJson()) {
            return ['success' => true, 'message' => 'User is authenticated.'];
        }
    }

    public function loggedOut(Request $request) {
        if($request->wantsJson()) {
            return ['success' => true, 'message' => 'User is logged out.'];
        }
    }
}
