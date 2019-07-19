<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    protected $table = 'calendars_beta';

    public $timestamps = false;

    public function getDynamicDataAttribute($value) {
        return json_decode($value, true);
    }

    public function getStaticDataAttribute($value) {
        return json_decode($value, true);
    }
}
