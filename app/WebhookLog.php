<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    use HasFactory;

    protected $table = 'webhooks_sent';

    protected $fillable = [
        'name', 'json', 'created_at', 'updated_at'
    ];

    protected $casts = [
        'json' => 'array'
    ];
}
