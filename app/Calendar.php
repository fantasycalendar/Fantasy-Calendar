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
        'parent_id',
        'parent_link_date',
        'parent_offset',
        'hash',
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

    public function getRouteKeyName() {
        return 'hash';
    }
}
