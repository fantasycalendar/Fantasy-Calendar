<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Calendar extends Model
{
    use SoftDeletes;

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
        'hash',
        'children',
        'master_hash',
    ];

    protected $hidden = [
        'event_categories',
        'events'
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function event_categories() {
        return $this->hasMany('App\EventCategory');
    }

    public function events() {
        return $this->hasMany('App\CalendarEvent');
    }

    public function child_calendars() {
        return $this->hasMany('App\Calendar', 'master_hash', 'hash');
    }

    public function getStaticDataAttribute($value) {
        $static_data = json_decode($value, true);

        $static_data['event_data']['categories'] = $this->event_categories->sortBy('sort_by')->values();

        $static_data['event_data']['events'] = $this->events->sortBy('sort_by')->values();

        if(!Auth::check() || !Auth::user()->can('update', $this)) {
            foreach($static_data['event_data']['events'] as $event){
                if($event['settings']['hide'] || (isset($event['settings']['full_hide']) && $event['settings']['full_hide'])){
                    $event['name'] = "Sneaky, sneaky...";
                    $event['description'] = "You shouldn't be here...";
                }
            }
        }

        return $static_data;
    }

    public function scopeActive($query) {
        return $query->where('deleted', 0);
    }

    public function getOwnedAttribute() {
        if (Auth::check() && ($this->user->id == Auth::user()->id || Auth::user()->isAdmin())) {
            return "true";
        }

        return "false";
    }

    public function getClockEnabledAttribute() {
        return isset($this->static_data['clock']['enabled']) && isset($this->dynamic_data['hour']) && isset($this->dynamic_data['minute']) && $this->static_data['clock']['enabled'];
    }

    public function current_date() {
        if(count($this->static_data['year_data']['timespans']) < 1) {
            return "N/A";
        }

        $month_id = $this->dynamic_data['timespan'] ?? $this->dynamic_data['month'] ?? 0;


        $year = $this->dynamic_data['year'];
        $month = $this->static_data['year_data']['timespans'][$month_id]['name'];
        $day = $this->dynamic_data['day'];


        return sprintf("%s %s, %s", $day, $month, $year);
    }

    public function current_time() {
        if(!$this->static_data['clock']['enabled']) {
            return "N/A";
        }

        return $this->dynamic_data['hour'] . ":" . $this->dynamic_data['minute'];
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

    public function getRouteKeyName() {
        return 'hash';
    }
}
