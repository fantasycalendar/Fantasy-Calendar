<?php

namespace App\Models;

use App\Collections\ErasCollection;
use App\Collections\MonthsCollection;
use App\Facades\Epoch;
use App\Models\Concerns\HasCalendarEvents;
use App\Models\Concerns\HasDate;
use App\Models\Concerns\HasEventCategories;
use App\Services\CalendarService\Era;
use App\Services\CalendarService\LeapDay;
use App\Services\CalendarService\RenderMonth;
use App\Services\CalendarService\Moon;
use App\Services\CalendarService\Timespan;
use App\Services\CalendarService\Month;
use App\Services\Discord\Models\DiscordWebhook;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * @property mixed static_data Calendar static data
 * @property mixed dynamic_data Calendar dynamic data
 * @property mixed user Calendar user
 * @property mixed current_date_valid Checks whether the current date in dynamic data is valid
 * @property mixed year The current year
 * @property mixed year_data Data structure of year_data in static data
 * @property mixed month_index Index of current month
 * @property mixed month_id Timespan ID of current month
 * @property mixed month_name Name of current month
 * @property mixed month_length Length property of current month (Does not include leap days)
 * @property mixed month_week Week used by the current month
 * @property mixed month_true_length Calculated length (Based on current year and leap days)
 * @property Month month Object representing the current month, as indicated by dynamic_data
 * @property RenderMonth render_month Data structure of current month
 * @property bool overflows_week Checks whether calendar overflows the week
 * @property mixed day Current day in month
 * @property mixed current_era_valid Checks whether the current era is valid
 * @property mixed users Calendar users added by owner of calendar
 * @property mixed leap_days
 * @property mixed timespans
 * @property mixed weekdays
 * @property mixed eras
 * @property mixed global_week
 * @property mixed first_day
 * @property mixed parent_count
 * @property mixed months_without_eras
 * @property float average_year_length
 * @property string hash
 * @property Epoch epoch
 * @property string name
 * @property string current_date
 * @property string raw_date
 * @method static findOrFail(array|\ArrayAccess|mixed $setting)
 */
class Calendar extends Model
{
    use SoftDeletes,
        HasDate,
        HasFactory,
        HasCalendarEvents,
        HasEventCategories;

    protected $casts = [
        'dynamic_data' => 'array',
        'static_data' => 'array',
    ];

    protected $dates = [
        'advancement_next_due'
    ];

    public $timestamps = false;

    public $fillable = [
        'user_id',
        'name',
        'dynamic_data',
        'static_data',
        'parent_id',
        'parent_link_date',
        'parent_offset',
        'hash',
        'converted_at',
        'conversion_batch',
        'advancement_enabled',
        'advancement_next_due',
        'advancement_time',
        'advancement_timezone',
        'advancement_real_rate',
        'advancement_real_rate_unit',
        'advancement_rate',
        'advancement_rate_unit',
        'advancement_webhook_url',
        'advancement_webhook_format',
        'advancement_discord_message_id',
    ];

    public Collection $leap_days_cached;
    public Collection $timespans_cached;
    public array $months_cached = [];

    /**
     * Hook on the model for when "booted"
     */
    protected static function booted()
    {
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('deleted', 0);
            $builder->whereNull('deleted_at');
        });
    }

    /**
     * Used internally by laravel to bind hash->calendar in routes
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'hash';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'calendar_user_role')->withPivot('user_role');;
    }

    public function event_categories(): HasMany
    {
        return $this->hasMany(EventCategory::class)->orderBy('sort_by');
    }

    public function events(): HasMany
    {
        return $this->hasMany(CalendarEvent::class)->orderBy('sort_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Calendar::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Calendar::class, 'parent_id');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(CalendarInvite::class);
    }

    public function preset(): HasOne
    {
        return $this->hasOne(Preset::class, 'source_calendar_id');
    }

    public function discord_webhooks(): HasMany
    {
        return $this->hasMany(DiscordWebhook::class);
    }

    public function updateWebhooks(string $message)
    {
        $this->discord_webhooks->each->post($message);
    }


    public function ensureCurrentEpoch(): Calendar
    {
        $this->dynamic('epoch', \App\Facades\Epoch::forCalendar($this)->forDate(
            $this->dynamic('year'),
            $this->dynamic('timespan'),
            $this->dynamic('day'),
        )->epoch);

        return $this;
    }

    /**
     * Determines whether a given set of static_data would result in modifying the calendar
     *
     * @param $static_data
     * @return bool
     */
    public function structureWouldBeModified($static_data): bool
    {

        if (!$this->isLinked()) {
            return false;
        }

        if (Arr::get($this->static_data, 'clock.enabled') != Arr::get($static_data, 'clock.enabled')) {
            return true;
        }

        if (Arr::get($this->static_data, 'clock.hours') != Arr::get($static_data, 'clock.hours')) {
            return true;
        }

        if (Arr::get($this->static_data, 'clock.minutes') != Arr::get($static_data, 'clock.minutes')) {
            return true;
        }

        if (Arr::get($this->static_data, 'year_data') != Arr::get($static_data, 'year_data')) {
            return true;
        }

        if (Arr::get($this->static_data, 'eras') != Arr::get($static_data, 'eras')) {
            return true;
        }

        return false;

    }

    public function isLinkable(): bool
    {
        return !$this->isChild()
            && !$this->advancement_enabled;
    }

    /**
     * Determine whether or not this calendar is linked to another
     *
     * @return bool
     */
    public function isLinked(): bool
    {
        return $this->isParent()
            || $this->isChild();
    }

    public function isParent(): bool
    {
        return $this->children()->exists();
    }

    public function isChild(): bool
    {
        return $this->parent()->exists();
    }

    public function yearIsValid($year): bool
    {
        return $this->timespans->filter->intersectsYear($year)->count() > 0;
    }

    /**
     * Filter for only calendars that are not deleted
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('deleted', 0);
    }

    /**
     * Determine whether the logged-in user is the owner of this calendar
     *
     * @return bool
     */
    public function getOwnedAttribute(): bool
    {
        return (
            Auth::check()
            && (
                $this->user->id == Auth::user()->id
                || Auth::user()->isAdmin()
            )
        );
    }

    /**
     * Determine whether the clock is enabled on this calendar
     *
     * @return bool
     */
    public function getClockEnabledAttribute(): bool
    {
        return isset($this->static_data['clock']['enabled'])
            && isset($this->dynamic_data['hour'])
            && isset($this->dynamic_data['minute'])
            && $this->static_data['clock']['enabled'];
    }

    public function getDailyMinutesAttribute(): int
    {
        return $this->clock_enabled
            ? $this->clock['hours'] * $this->clock['minutes']
            : 0;
    }

    /**
     * Determine whether the current date on this calendar is valid
     *
     * @return bool
     */
    public function getCurrentDateValidAttribute(): bool
    {
        if (count($this->static_data['year_data']['timespans']) < 1) {
            return false;
        }

        if (!Arr::has($this->static_data, "year_data.timespans.{$this->month_id}")) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether or not the current era on this calendar is valid
     *
     * @return bool
     */
    public function getCurrentEraValidAttribute(): bool
    {
        return (
            count($this->static_data['eras'] ?? []) > 0

            && ($this->dynamic_data['current_era'] ?? -1) > -1
        );
    }

    /**
     * @return mixed
     */
    public function getEpochAttribute()
    {
        return Epoch::forCalendarDay($this);
    }

    /**
     * Get the average year length
     *
     * @return int
     */
    public function getAverageYearLengthAttribute(): float
    {
        return $this->timespans->sum->averageLength;
    }

    /**
     * Get the current date in a string
     *
     * @return string
     */
    public function getCurrentDateAttribute(): string
    {
        if(!$this->current_date_valid) {
            return "N/A";
        }

        $year = $this->year;
        $month = $this->month_name;
        $day = $this->day;

        return sprintf("%s %s, %s", $day, $month, $year);
    }

    /**
     * Get the current date as an array
     *
     * @return array
     */
    public function getRawDateAttribute(): array
    {
        if(!$this->current_date_valid) {
            return [];
        }

        return [
            $this->year,
            $this->month_id,
            $this->day,
            $this->dynamic_data["hour"],
            $this->dynamic_data["minute"],
        ];
    }

    /**
     * Get the current year of this calendar
     *
     * @return int
     */
    public function getYearAttribute(): int
    {
        return (int) Arr::get($this->dynamic_data, 'year', 0);
    }

    public function getYearLengthAttribute(): int
    {
        return $this->months->sum(function($month){
            return $month->daysInYear->count();
        });
    }

    public function getAverageMonthsCountAttribute(): float
    {
        return $this->timespans->sum(function($timespan){
            return 1 / $timespan->interval;
        });
    }

    public function getClockAttribute(): Collection
    {
        return collect(Arr::get($this->static_data, 'clock'));
    }

    /**
     * Get the "year data" for this calendar
     *
     * @return array
     */
    public function getYearDataAttribute(): array
    {
        return Arr::get($this->static_data, 'year_data');
    }

    /**
     * Get the first weekday for this calendar
     *
     * @return array
     */
    public function getFirstDayAttribute(): int
    {
        return Arr::get($this->year_data, 'first_day');
    }

    /**
     * Get a collection of the timespans available on this calendar
     *
     * @return Collection
     */
    public function getTimespansAttribute(): Collection
    {
        if(!isset($this->timespans_cached)) {
            $this->timespans_cached = collect(Arr::get($this->static_data, 'year_data.timespans'))->map(function($timespan_details, $timespan_key){
                return new Timespan(array_merge($timespan_details, ['id' => $timespan_key]));
            })->each->setCalendar($this);
        }

        return $this->timespans_cached;
    }

    /**
     * Get a collection of the months in this calendar year
     *
     * @return MonthsCollection
     */
    public function getMonthsAttribute(): MonthsCollection
    {
        if(isset($this->months_cached[$this->year])) return $this->months_cached[$this->year];

        $yearEndingEra = $this->eras
            ->reject->isStartingEra()
            ->filter->endsGivenYear($this->year)
            ->first();

        $this->months_cached[$this->year] = $this->months_without_eras
            ->filter->intersectsYear($this->year)
            ->endsOn($yearEndingEra)->values();

        return $this->months_cached[$this->year];
    }

    /**
     * Re-build a MonthsCollection without taking eras into account
     *
     * @return MonthsCollection
     */
    public function getMonthsWithoutErasAttribute(): MonthsCollection
    {
        return MonthsCollection::fromArray(Arr::get($this->static_data, 'year_data.timespans'), $this);
    }

    /**
     * Get the index of the current month **in the current calendar year**
     *
     * @return int
     */
    public function getMonthIndexAttribute(): int
    {
        return $this->months->filter(function($timespan){
            return $timespan->id == $this->month_id;
        })
            ->keys()
            ->first();
    }

    /**
     * Calculates the "true" length of the current month by checking for leap days that contribute to it
     *
     * @return int
     */
    public function getMonthTrueLengthAttribute(): int
    {
        return $this->month_length + $this->leap_days
                ->where('timespan', '=', $this->month_id)
                ->filter(function($leapDay){
                    return $leapDay->intersectsYear($this->year);
                })->count();
    }

    /**
     * Get the ID of the current month
     * This is the where the month falls in **all** available timespans in this calendar structure
     *
     * @return int
     */
    public function getMonthIdAttribute(): int
    {
        return Arr::get($this->dynamic_data,
            'timespan',
            Arr::get($this->dynamic_data,
                'month',
                0));
    }

    /**
     * Get the global weekdays for this calendar
     *
     * @return Collection
     */
    public function getGlobalWeekAttribute(): Collection
    {
        return collect(Arr::get($this->year_data, 'global_week'));
    }

    /**
     * Get the list of weekdays for the current month
     *
     * @return Collection
     */
    public function getWeekdaysAttribute(): Collection
    {
        return $this->month->weekdays;
    }

    /**
     * Determine whether this calendar is set to overflow the week
     *
     * @return bool
     */
    public function getOverflowsWeekAttribute(): bool
    {
        return Arr::get($this->year_data, 'overflow', false);
    }

    /**
     * Get the name of the current month
     *
     * @return string
     */
    public function getMonthNameAttribute(): string
    {
        return Arr::get($this->static_data, "year_data.timespans.{$this->month_id}.name", "");
    }

    public function getMonthAttribute(): Month
    {
        return $this->months->sole(function($month){
            return $month->id === $this->month_id;
        });
    }

    /**
     * Get a RenderMonth object representing the current month
     *
     * @return RenderMonth
     */
    public function getRenderMonthAttribute(): RenderMonth
    {
        return new RenderMonth($this);
    }

    /**
     * Get the set length of the current month (not including leap days)
     *
     * @return int
     */
    public function getMonthLengthAttribute(): int
    {
        return Arr::get($this->static_data, "year_data.timespans.{$this->month_id}.length", 0);
    }

    /**
     * Get the moons of this calendar as a collection of Moon objects
     *
     * @return Collection
     */
    public function getMoonsAttribute(): Collection
    {
        return collect(Arr::get($this->static_data, 'moons'))->map(function($moon){
            return new Moon($moon);
        });
    }

    /**
     * Get the current day set on this calendar
     *
     * @return int
     */
    public function getDayAttribute(): int
    {
        return clamp(Arr::get($this->dynamic_data, 'day', 1), 1, $this->month->countDaysInYear());
    }

    /**
     * Get the leap days on this calendar as a collection
     *
     * @return Collection
     */
    public function getLeapDaysAttribute(): Collection
    {
        if(!isset($this->leap_days_cached)) {
            $this->leap_days_cached = collect(Arr::get($this->static_data, 'year_data.leap_days'))->map(function($leap_day){
                return new LeapDay($this, $leap_day);
            });
        }

        return $this->leap_days_cached;
    }

    /**
     * Get the current time on this calendar, in string display format
     *
     * @return string
     */
    public function getCurrentTimeAttribute(): string
    {
        if(!$this->clock_enabled) {
            return "N/A";
        }

        $hours = strlen($this->clock['hours']);
        $minutes = strlen($this->clock['minutes']);

        $hour = Str::padLeft($this->dynamic_data['hour'], $hours, '0');
        $minute = Str::padLeft($this->dynamic_data['minute'], $minutes, '0');

        return $hour . ":" . $minute;
    }

    /**
     * Get the name of the current era on this calendar
     *
     * @return string
     */
    public function getCurrentEraAttribute(): string
    {
        if(!$this->current_era_valid){
            return 'N/A';
        }

        $current_era_index = $this->dynamic_data['current_era'];

        $current_era = $this->static_data['eras'][$current_era_index];

        return $current_era['name'];
    }

    /**
     * Get an ErasCollection containing all the eras on this calendar, sorted by year
     *
     * @return ErasCollection
     */
    public function getErasAttribute(): ErasCollection
    {
        return (new ErasCollection(Arr::get($this->static_data, 'eras')))->map(function($era){
            return new Era($era);
        })->sortBy('year');
    }

    /**
     * @param string|array|\ArrayAccess $input
     * @param mixed|null $value
     * @return array|\ArrayAccess|mixed
     */
    public function dynamic($input, $value = null)
    {
        if (is_string($input) && $value === null) return Arr::get($this->dynamic_data, $input);

        if(!is_array($input)) {
            $input = [
                $input => $value
            ];
        }

        $dynamic_data = $this->dynamic_data;
        foreach($input as $key => $value) {
            $dynamic_data[$key] = $value;
        }

        return $this->dynamic_data = $dynamic_data;
    }

    /**
     * Determine whether a setting is enabled or disabled on this calendar
     *
     * @param $setting_name
     * @param false $default
     * @return mixed
     */
    public function setting($setting_name, $default = false)
    {
        return $this->static_data['settings'][$setting_name] ?? $default;
    }

    /**
     * Set a setting on this calendar
     *
     * @param $setting_name
     * @param $new_value
     */
    public function setSetting($setting_name, $new_value) {
        $this->static_data['settings'][$setting_name] = $new_value;
    }

    /**
     * Search for a calendar by name
     *
     * @param Builder $query
     * @param $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, $search): Builder
    {
        return $query->where('name', 'like', "%$search%");
    }

    /**
     * Retrieve a calendar by hash
     *
     * @param Builder $query
     * @param $hash
     * @return Builder
     */
    public function scopeHash(Builder $query, $hash): Builder
    {
        return $query->where('hash', $hash);
    }

    /**
     * Retrieve calendars belonging to a user ID
     *
     * @param Builder $query
     * @param $user_id
     * @return Builder
     */
    public function scopeUser(Builder $query, $user_id): Builder
    {
        return $query->where('user_id', $user_id);
    }

    public function scopeDisabled(Builder $query): Builder
    {
        return $query->where('disabled', '=', true);
    }

    public function scopeDueForAdvancement(Builder $query): Builder
    {
        return $query->where('advancement_enabled', true)
            ->whereHas('user', function(Builder $query) {
                return $query->premium();
            })->where(function(Builder $query) {
                $query->where('advancement_next_due', '<=', now())
                    ->orWhereNull('advancement_next_due');
            });
    }

    /**
     * Determine whether a user has a particular role on this calendar
     *
     * @param User $user
     * @param $role
     * @return bool
     */
    public function userHasPerms(User $user, $role): bool
    {
        $roles = [
            'invitee' => 0,
            'observer' => 10,
            'player' => 20,
            'co-owner' => 30
        ];

        if(!$this->isPremium()) {
            return false;
        }

        if(!$this->users->contains($user)) {
            return false;
        }

        $userRole = $this->users->find($user->id)->pivot->user_role;

        return $roles[$userRole] >= $roles[$role];
    }

    /**
     * Determine whether this calendar (via its user) is premium-enabled
     *
     * @return bool
     */
    public function isPremium(): bool
    {
        return $this->user->isPremium();
    }

    /**
     * Remove a user from a calendar, optionally specifying to remove all.
     * You can also specify an email to cancel invitations.
     *
     * @param $user
     * @param false $remove_all
     * @param false $email
     * @return bool
     */
    public function removeUser($user, $remove_all = false, $email = false): bool
    {
        $id = ($user instanceof User) ? $user->id : $user;

        if($this->users()->where('users.id', $id)->exists()) {
            $this->users()->detach($id);
            $this->save();
        }

        if($email) {
            $this->invitations()->where('email', $email)->each(function($invitation) {
                $invitation->reject();
            });
        }

        if($remove_all) {
            $this->events()->where('creator_id', $id)->delete();
        }

        return true;
    }

    public function imageLink($ext, $attributes = [])
    {
        return route('calendars.image',
            array_merge($attributes, [
                'calendar' => $this,
                'ext' => $ext,
            ]));
    }

    public function ensureAdvancmentIsInitialized()
    {
        collect([
            'advancement_timezone' => 'America/New_York',
            'advancement_real_rate' => 1,
            'advancement_real_rate_unit' => $this->clockEnabled ? 'hours' : 'days',
            'advancement_rate' => 1,
            'advancement_rate_unit' => $this->clockEnabled ? 'hours' : 'days',
            'advancement_webhook_format' => 'discord',
        ])->each(function($value, $attribute){
            if(!$this->$attribute) {
                $this->$attribute = $value;
            }
        });

        $this->save();
    }
}
