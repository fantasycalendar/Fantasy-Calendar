<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements 
    MustVerifyEmail,
    CanResetPassword
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 
        'password', 
        'username', 
        'reg_ip', 
        'beta_authorised',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function calendars() {
        return $this->hasMany('App\Calendar');
    }

    public function isAdmin() {
        return $this->permissions == 1;
    }

    public function isVerified() {
        return !is_null($this->email_verified_at);
    }

    public function betaAccess() {
        return $this->beta_authorised == 1;
    }
}
