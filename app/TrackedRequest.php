<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrackedRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        "domain",
        "path",
        "parameters",
        "target"
    ];

    protected $hidden = [
        "created_at",
        "updated_at"
    ];
}
