<?php

namespace App\Http\Controllers;

use Hash;
use Illuminate\Http\Request;
use Auth;

class AccountDeletionController extends Controller
{

    public function set(Request $request){

        if(!Hash::check($request->get('password'), Auth::user()->password)){
            return redirect()->back()->withErrors(['password' => 'Invalid password.']);
        }

        Auth::user()->delete_requested_at = now();
        Auth::user()->save();

        return view('pages.account-deletion-warning', [
            'user' => Auth::user(),
            'requested_at' => Auth::user()->delete_requested_at->toFormattedDateString(),
            'delete_at' => Auth::user()->delete_requested_at->addDays(14)->toFormattedDateString(),
        ]);
        
    }

    public function cancel(){

        if(!Auth::user()->delete_requested_at){
            return redirect('calendars');
        }
        
        Auth::user()->delete_requested_at = Null;
        Auth::user()->save();

        return redirect('calendars');
        
    }

    public function warning(){

        if(!Auth::user()->delete_requested_at){
            return redirect('calendars');
        }

        return view('pages.account-deletion-warning', [
            'user' => Auth::user(),
            'requested_at' => Auth::user()->delete_requested_at->toFormattedDateString(),
            'delete_at' => Auth::user()->delete_requested_at->addDays(14)->toFormattedDateString(),
        ]);
        
    }

}
