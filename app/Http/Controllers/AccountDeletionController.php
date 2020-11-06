<?php

namespace App\Http\Controllers;

use Hash;
use Illuminate\Http\Request;
use Auth;
use App\Mail\AccountDeletionRequest;
use Illuminate\Support\Facades\Mail;

class AccountDeletionController extends Controller
{

    public function set(Request $request){

        $user = Auth::user();

        if(!Hash::check($request->get('password'), $user->password)){
            return redirect()->back()->withErrors(['password' => 'Invalid password.']);
        }

        $user->delete_requested_at = now();
        $user->save();

        Mail::to($user)->send(new AccountDeletionRequest($user));
        
        return view('pages.account-deletion-warning', [
            'user' => $user,
            'requested_at' => $user->delete_requested_at->toFormattedDateString(),
            'delete_at' => $user->delete_requested_at->addDays(14)->toFormattedDateString(),
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
