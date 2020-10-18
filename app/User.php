<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Cashier\Billable;
use Carbon\Carbon;
use Arr;
use Str;

class User extends Authenticatable implements
    MustVerifyEmail,
    CanResetPassword
{
    use Notifiable, Billable;

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
        'password',
        'remember_token',
        'active',
        'created_at',
        'updated_at',
        'stripe_id',
        'card_brand',
        'card_last_four',
        'trial_ends_at',
        'date_update_pass',
        'date_register',
        'reg_ip',
        'settings',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'settings' => 'json',
        'agreed_at' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function calendars() {
        return $this->hasMany('App\Calendar');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function related_calendars() {
        return $this->belongsToMany('App\Calendar', 'calendar_user_role')->withPivot('user_role');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function agreement() {
        return $this->belongsTo('App\Agreement');
    }

    /**
     * @return bool
     */
    public function isAdmin() {
        return $this->permissions == 1;
    }

    /**
     * @return bool
     */
    public function isVerified() {
        return !is_null($this->email_verified_at);
    }

    /**
     * @return bool
     */
    public function isEarlySupporter() {
        return $this->email_verified_at <= (new Carbon('2020-03-25'));
    }

    /**
     * @return bool
     */
    public function betaAccess() {
        return $this->beta_authorised == 1;
    }

    /**
     * @return $this
     */
    public function generateApiToken()
    {
        $this->api_token = Str::random(60);
        $this->save();

        return $this;
    }

    /**
     * @param $setting
     * @param $value
     */
    public function setSetting($setting, $value) {
        $settings = $this->settings;

        $settings[$setting] = $value;
    }

    /**
     * @param $setting
     * @return mixed|null
     */
    public function setting($setting) {
        if(Arr::has($this->settings, $setting)) {
            return $this->settings[$setting];
        }

        return null;
    }

    /**
     * @param $settings
     * @return $this
     */
    public function setSettings($settings) {
        $userSettings = $this->settings;

        foreach($settings as $setting => $value) {
            $userSettings[$setting] = $value;
        }

        $this->settings = $userSettings;
        $this->save();

        return $this;
    }

    public function isPremium() {
        return $this->subscribedToPlan(['timekeeper_monthly', 'timekeeper_yearly'], 'Timekeeper') || $this->betaAccess();
    }

    /**
     * @return string
     */
    public function paymentLevel() {

        if ($this->subscribedToPlan(['timekeeper_monthly', 'timekeeper_yearly'], 'Timekeeper') || $this->betaAccess()) {
            return 'Timekeeper';
        }

        return 'Free';
    }

    public function acknowledgeMigration() {
        $this->acknowledged_migration = 1;
        $this->save();

        return $this;
    }

    public function hasAgreedToTOS() {
        if($this->agreement){
            $latest_agreement = Agreement::where("in_effect_at", "<=", now())->latest()->first();
            return $this->agreed_at > $latest_agreement->in_effect_at || $latest_agreement != $this->agreement;
        }
        return false;
    }
}
