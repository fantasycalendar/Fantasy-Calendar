<?php

namespace App\Models;

use App\Models\Concerns\SyncsSubscriptions;
use App\Services\Discord\Models\DiscordAuthToken;
use App\Services\Discord\Models\DiscordGuild;
use App\Services\Discord\Models\DiscordInteraction;
use App\Services\Discord\Models\DiscordWebhook;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Cashier\Billable;
use Carbon\Carbon;
use Arr;
use Laravel\Sanctum\HasApiTokens;
use Str;
use Stripe\StripeClient;

class User extends Authenticatable implements
    MustVerifyEmail,
    CanResetPassword,
    FilamentUser,
    HasName
{
    use Notifiable,
        Billable,
        SyncsSubscriptions,
        SoftDeletes,
        HasFactory,
        HasApiTokens;

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
        'agreement_id',
        'policy_id',
        'agreed_at',
        'marketing_opt_in_at',
        'marketing_opt_out_at',
        'email_verified_at',
        'has_sent_announcement',
        'last_interaction',
        'last_login',
        'last_visit',
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
        'reg_ip',
        'api_token'
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
        'delete_requested_at' => 'datetime',
        'date_register' => 'datetime',
    ];

    protected $dateFormat = 'Y-m-d H:i:s';

    public function getFilamentName(): string
    {
        return $this->username;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function calendars() {
        return $this->hasMany(\App\Models\Calendar::class);
    }

    public function discord_auth() {
        return $this->hasOne(DiscordAuthToken::class);
    }

    public function discord_guilds() {
        return $this->hasMany(DiscordGuild::class);
    }

    public function discord_interactions() {
        return $this->hasMany(DiscordInteraction::class);
    }

    public function discord_webhooks() {
        return $this->hasMany(DiscordWebhook::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function related_calendars() {
        return $this->belongsToMany(\App\Models\Calendar::class, 'calendar_user_role')->withPivot('user_role');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function agreement() {
        return $this->belongsTo(App\Models\Agreement::class);
    }

    public function getSubscriptionEndAttribute()
    {
        return $this->subscriptions()->active()->first()?->asStripeSubscription()->current_period_end;
    }

    public function getMarketingAttribute()
    {
        return $this->hasOptedInForMarketing();
    }

    public function getAvatarUrlAttribute()
    {
        return "https://unavatar.now.sh/{$this->email}?fallback=https://beta.fantasy-calendar.com/resources/logo-accent.png";
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
        return $this->created_at <= (new Carbon('2020-11-08'));
    }

    public function getIsEarlySupporterAttribute() {
        return $this->isEarlySupporter();
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

    // If Stripe is not enabled as a feature, we just want all the premium things available.
    public function isPremium() {
        if(!feature('stripe')) {
            return true;
        }

        return $this->paymentLevel() !== 'Free';
    }

    public function getIsPremiumAttribute() {
        return $this->isPremium();
    }

    public function subscriptionPrice($interval) {
        if($this->isEarlySupporter()) {
            if($interval === 'monthly') {
                return '$1.99';
            }

            return '$19.99';
        }

        if($interval == "monthly") {
            return '$2.49';
        }

        return '$24.99';
    }

    /**
     * @return string
     */
    public function paymentLevel() {

        if ($this->subscribedToPrice(['timekeeper_monthly', 'timekeeper_yearly'], 'Timekeeper') || $this->betaAccess()) {
            return 'Timekeeper';
        }

        return 'Free';
    }

    public function acknowledgeMigration() {
        $this->acknowledged_migration = 1;
        $this->save();

        return $this;
    }

    public function acknowledgedDiscordAnnouncement() {
        $this->acknowledged_discord_announcement = 1;
        $this->save();

        return $this;
    }

    public function hasAgreedToTOS() {
        return $this->agreement_id !== null;
    }

    public function acceptAgreement() {
        $this->agreement_id = Agreement::current()->id;
        $this->policy_id = Policy::current()->id;

        $this->agreed_at = now();
        $this->save();

        return $this;
    }

    public function hasOptedInForMarketing() {
        return $this->marketing_opt_in_at !== null && $this->marketing_opt_in_at > $this->marketing_opt_out_at;
    }

    public function setMarketingStatus($optIn = True) {
        if($optIn){
            $this->policy_id = Policy::current()->id;
            $this->marketing_opt_in_at = now();
        }else{
            $this->marketing_opt_out_at = now();
        }
        $this->save();

        return $this;
    }

    public function hasDiscord() {
        return $this->isPremium() && $this->discord_auth()->exists();
    }

    public function hasCalendar($calendar)
    {
        return $this->calendars()
            ->whereId($calendar)
            ->exists();
    }

    public function getInvitations()
    {
        return (CalendarInvite::active()->forUser($this->email)->exists())
            ? CalendarInvite::active()->forUser($this->email)->get()
            : [];
    }

    public function startSubscription($level, $plan, $token)
    {
        $stripe = new StripeClient(config('services.stripe.secret_key'));
        # If the users was registered before a certain point, apply the 25% off
        $sub = $this->newSubscription($level, $plan);

        if($this->isEarlySupporter()) {
            if($couponId =
                collect($stripe->coupons->all()['data'])
                    ->filter(fn($coupon) => $coupon['name'] == 'Early Supporter')
                    ->first()
                    ?->id
            ) {
                $sub->withCoupon($couponId);
            }
        }

        $sub->create($token);

        $this->calendars()->update([
            'disabled' => 0
        ]);
    }

    public function scopePremium(Builder $query)
    {
        return $query->whereHas('subscriptions', function(Builder $query){
            return $query->whereStripeStatus('active');
        })->orWhere('beta_authorised', '=', true);
    }

    public function scopeVerified($query)
    {
        $query->whereNotNull('email_verified_at');
    }

    public function canAccessFilament(): bool
    {
        return $this->isAdmin();
    }
}
