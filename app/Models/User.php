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
use Filament\Panel;
use Laravel\Sanctum\HasApiTokens;
use Str;
use Stripe\StripeClient;

/**
 * 
 *
 * @property int $id
 * @property string $username
 * @property string $password
 * @property string|null $api_token
 * @property int $permissions
 * @property string $email
 * @property int $active
 * @property string $date_update_pass
 * @property \Illuminate\Support\Carbon $date_register
 * @property string $reg_ip
 * @property int $beta_authorised
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property string|null $trial_ends_at
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property array|null $settings
 * @property int $migrated
 * @property int $acknowledged_migration
 * @property \Illuminate\Support\Carbon|null $agreed_at
 * @property int|null $agreement_id
 * @property string|null $marketing_opt_in_at
 * @property string|null $marketing_opt_out_at
 * @property int|null $policy_id
 * @property \Illuminate\Support\Carbon|null $delete_requested_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int $has_sent_announcement
 * @property int $acknowledged_discord_announcement
 * @property string|null $last_interaction
 * @property string|null $last_login
 * @property string|null $last_visit
 * @property string|null $banned_at
 * @property string|null $banned_reason
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Calendar> $calendars
 * @property-read int|null $calendars_count
 * @property-read DiscordAuthToken|null $discord_auth
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DiscordGuild> $discord_guilds
 * @property-read int|null $discord_guilds_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DiscordInteraction> $discord_interactions
 * @property-read int|null $discord_interactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DiscordWebhook> $discord_webhooks
 * @property-read int|null $discord_webhooks_count
 * @property-read mixed $avatar_url
 * @property-read mixed $is_early_supporter
 * @property-read mixed $is_premium
 * @property-read mixed $marketing
 * @property-read mixed $subscription_end
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Calendar> $related_calendars
 * @property-read int|null $related_calendars_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Cashier\Subscription> $subscriptions
 * @property-read int|null $subscriptions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static Builder|User hasExpiredGenericTrial()
 * @method static Builder|User marketingEnabled()
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User onGenericTrial()
 * @method static Builder|User onlyTrashed()
 * @method static Builder|User premium()
 * @method static Builder|User query()
 * @method static Builder|User verified()
 * @method static Builder|User whereAcknowledgedDiscordAnnouncement($value)
 * @method static Builder|User whereAcknowledgedMigration($value)
 * @method static Builder|User whereActive($value)
 * @method static Builder|User whereAgreedAt($value)
 * @method static Builder|User whereAgreementId($value)
 * @method static Builder|User whereApiToken($value)
 * @method static Builder|User whereBetaAuthorised($value)
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereDateRegister($value)
 * @method static Builder|User whereDateUpdatePass($value)
 * @method static Builder|User whereDeleteRequestedAt($value)
 * @method static Builder|User whereDeletedAt($value)
 * @method static Builder|User whereEmail($value)
 * @method static Builder|User whereEmailVerifiedAt($value)
 * @method static Builder|User whereHasSentAnnouncement($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User whereLastInteraction($value)
 * @method static Builder|User whereLastLogin($value)
 * @method static Builder|User whereLastVisit($value)
 * @method static Builder|User whereMarketingOptInAt($value)
 * @method static Builder|User whereMarketingOptOutAt($value)
 * @method static Builder|User whereMigrated($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User wherePermissions($value)
 * @method static Builder|User wherePmLastFour($value)
 * @method static Builder|User wherePmType($value)
 * @method static Builder|User wherePolicyId($value)
 * @method static Builder|User whereRegIp($value)
 * @method static Builder|User whereRememberToken($value)
 * @method static Builder|User whereSettings($value)
 * @method static Builder|User whereStripeId($value)
 * @method static Builder|User whereTrialEndsAt($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @method static Builder|User whereUsername($value)
 * @method static Builder|User withTrashed()
 * @method static Builder|User withoutTrashed()
 * @property-read \App\Models\Agreement|null $agreement
 * @mixin \Eloquent
 */
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
        'banned_at',
        'banned_reason'
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
        'banned_at' => 'datetime'
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
        return $this->belongsTo(Agreement::class);
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
        return "https://unavatar.io/{$this->email}?fallback=https://beta.fantasy-calendar.com/resources/logo-accent.png";
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

    public function scopeMarketingEnabled(Builder $query): Builder
    {
        return $query->where(function($query){
            $query->whereNotNull('marketing_opt_in_at')
                ->whereNull('marketing_opt_out_at');
        })->orWhere(function($query){
            $query->where("marketing_opt_in_at", ">", "marketing_opt_out_at");
        });
    }

    public function scopePremium(Builder $query): Builder
    {
        return $query->whereHas('subscriptions', function(Builder $query){
            return $query->whereStripeStatus('active');
        })->orWhere('beta_authorised', '=', true);
    }

    public function scopeVerified($query): Builder
    {
        return $query->whereNotNull('email_verified_at');
    }

    public function canAccessFilament(\Filament\Panel $panel): bool
    {
        return $this->isAdmin();
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin();
    }

    public function isBanned(): bool
    {
        return $this->banned_at !== null;
    }

    public function bannedReason(): string
    {
        return $this->banned_reason;
    }
}
