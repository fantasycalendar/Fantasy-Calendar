<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function impersonate($userid) {
        request()->session()->push('admin.id', Auth::user()->id);

        if(request()->has('returnPath')) {
            ld(request()->get('returnPath'));
            request()->session()->put('return_path', request()->get('returnPath'));
        }

        Auth::logout();

        Auth::loginUsingId($userid);

        return redirect()->route('home');
    }

    public function reverseImpersonate()
    {
        if(!request()->session()->has('admin.id')) {
            return redirect('/');
        }

        ld(request()->session()->get('return_path'));

        Auth::logout();
        Auth::loginUsingId(request()->session()->get('admin.id'));
        request()->session()->remove('admin.id');

        return redirect(request()->session()->get('return_path') ?? '/');
    }
}
