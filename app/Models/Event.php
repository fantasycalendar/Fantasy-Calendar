<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;


    // TODO: Change this to just `events` at some point.
    protected $table = 'calendar_events';
}
