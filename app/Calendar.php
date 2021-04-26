<?php

namespace App;

use App\Services\CalendarService\LeapDay;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;
use Illuminate\Support\Arr;

/**
 * @property mixed static_data Calendar static data
 * @property mixed dynamic_data Calendar dynamic data
 * @property mixed user Calendar user
 * @property mixed current_date_valid Checks whether the current date in dynamic data is valid
 * @property mixed year The current year
 * @property mixed year_data Data structure of year_data in static data
 * @property mixed month_id ID of current month
 * @property mixed month_name Name of current month
 * @property mixed month_length Length property of current month (Does not include leap days)
 * @property mixed month_week Week used by the current month
 * @property mixed month_true_length Calculated length (Based on current year and leap days)
 * @property array month Data structure of current month
 * @property bool overflows_week Checks whether calendar overflows the week
 * @property mixed day Current day in month
 * @property mixed current_era_valid Checks whether the current era is valid
 * @property mixed users Calendar users added by owner of calendar
 * @property mixed leap_days
 */
class Calendar extends Model
{
    use SoftDeletes;

    /**
     * @var string
     */
    protected $table = 'calendars_beta';

    protected $with = ['event_categories', 'events'];

    protected $casts = [
        'dynamic_data' => 'array',
        'static_data' => 'array',
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
        'conversion_batch'
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function users() {
        return $this->belongsToMany('App\User', 'calendar_user_role')->withPivot('user_role');;
    }

    public function event_categories() {
        return $this->hasMany('App\EventCategory')->orderBy('sort_by');
    }

    public function events() {
        return $this->hasMany('App\CalendarEvent')->orderBy('sort_by');
    }

    public function parent() {
        return $this->belongsTo('App\Calendar', 'parent_id');
    }

    public function children() {
        return $this->hasMany('App\Calendar', 'parent_id');
    }

    public function invitations() {
        return $this->hasMany('App\CalendarInvite');
    }


    public function structureWouldBeModified($static_data){

        if(!$this->isLinked()){
            return false;
        }

        if($this->static_data['clock']['enabled'] != $static_data['clock']['enabled']){
            return true;
        }

        if($this->static_data['clock']['hours'] != $static_data['clock']['hours']){
            return true;
        }

        if($this->static_data['clock']['minutes'] != $static_data['clock']['minutes']){
            return true;
        }

        if($this->static_data['year_data'] != $static_data['year_data']){
            return true;
        }

        if($this->static_data['eras'] != $static_data['eras']){
            return true;
        }

        return false;

    }

    public function isLinked() {
        return $this->parent()->exists() || $this->children()->count() > 0;
    }

    public function scopeActive($query) {
        return $query->where('deleted', 0);
    }

    public function getOwnedAttribute() {
        if (Auth::check() && ($this->user->id == Auth::user()->id || Auth::user()->isAdmin())) {
            return true;
        }

        return false;
    }

    public function getClockEnabledAttribute() {
        return isset($this->static_data['clock']['enabled']) && isset($this->dynamic_data['hour']) && isset($this->dynamic_data['minute']) && $this->static_data['clock']['enabled'];
    }

    public function getCurrentDateValidAttribute() {
        if(count($this->static_data['year_data']['timespans']) < 1) {
            return false;
        }

        if(!Arr::has($this->static_data, "year_data.timespans.{$this->month_id}")) {
            return false;
        }

        return true;
    }

    public function getCurrentEraValidAttribute() {
        return (
            count($this->static_data['eras'] ?? []) > 0

            && ($this->dynamic_data['current_era'] ?? -1) > -1
        );
    }

    public function setDate($year, $timespan, $day)
    {
        $dynamic_data = $this->dynamic_data;

        $dynamic_data['year'] = $year ?? $dynamic_data['year'];
        $dynamic_data['timespan'] = $timespan ?? $dynamic_data['timespan'];
        $dynamic_data['day'] = $day ?? $dynamic_data['day'];

        $this->dynamic_data = $dynamic_data;
    }

    public function getCurrentDateAttribute() {
        if(!$this->current_date_valid) {
            return "N/A";
        }

        $year = $this->year;
        $month = $this->month_name;
        $day = $this->dynamic_data['day'];

        return sprintf("%s %s, %s", $day, $month, $year);
    }

    public function getYearAttribute()
    {
        return (int) Arr::get($this->dynamic_data, 'year', 0);
    }

    public function getYearDataAttribute()
    {
        return Arr::get($this->static_data, 'year_data');
    }

    public function getMonthIdAttribute()
    {
        return Arr::get($this->dynamic_data,
            'timespan',
            Arr::get($this->dynamic_data,
                'month',
                0));
    }

    /*
     * Calculates the "true" length of a month by checking for leap days that intersect
     */
    public function getMonthTrueLengthAttribute()
    {
        return $this->month_length + collect($this->leap_days)
                ->where('timespan', '=', $this->month_id)
                ->filter(function($leapDay){
                    return (new LeapDay($leapDay))->intersectsYear($this->year);
                })->count();
    }

    public function getMonthWeekAttribute()
    {
        return Arr::get($this->month, 'week', Arr::get($this->year_data, 'global_week'));
    }

    public function getOverflowsWeekAttribute()
    {
        return Arr::get($this->year_data, 'overflows');
    }

    public function getMonthNameAttribute()
    {
        return Arr::get($this->static_data, "year_data.timespans.{$this->month_id}.name", null);
    }

    public function getMonthAttribute()
    {
        return Arr::get($this->static_data, "year_data.timespans.{$this->month_id}", []);
    }

    public function getMonthLengthAttribute()
    {
        return Arr::get($this->static_data, "year_data.timespans.{$this->month_id}.length", null);
    }

    public function getDayAttribute()
    {
        return Arr::get($this->dynamic_data, 'day', 0);
    }

    public function getLeapDaysAttribute()
    {
        return Arr::get($this->static_data, 'year_data.leap_days');
    }

    public function getCurrentTimeAttribute() {
        if(!$this->static_data['clock']['enabled']) {
            return "N/A";
        }

        return $this->dynamic_data['hour'] . ":" . $this->dynamic_data['minute'];
    }

    public function getCurrentEraAttribute() {

        if(!$this->current_era_valid){
            return 'N/A';
        }

        $current_era_index = $this->dynamic_data['current_era'];

        $current_era = $this->static_data['eras'][$current_era_index];

        return $current_era['name'];
    }

    public function setting($setting_name, $default = false) {
        return $this->static_data['settings'][$setting_name] ?? $default;
    }

    public function setSetting($setting_name, $new_value) {
        $this->static_data['settings'][$setting_name] = $new_value;
    }

    public function scopeSearch($query, $search) {
        return $query->where('name', 'like', "%$search%");
    }

    public function scopeHash($query, $hash) {
        return $query->where('hash', $hash);
    }

    public function scopeUser($query, $user_id) {
        return $query->where('user_id', $user_id);
    }

    public function userHasPerms(User $user, $role) {
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

    public function isPremium() {
        return $this->user->isPremium();
    }

    public function getRouteKeyName() {
        return 'hash';
    }

    public function removeUser($user, $remove_all = false, $email = false) {
        $id = ($user instanceof \App\User) ? $user->id : $user;

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

    private function yearIntersectsLeapDay($interval, $offset)
    {
        return false;
        return ($this->year + $offset) % $interval == 0;
    }
}
