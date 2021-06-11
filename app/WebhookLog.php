<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    use HasFactory;

    protected string $table = 'webhooks_sent';

    protected array $fillable = [
        'name', 'json', 'created_at', 'updated_at'
    ];

    protected array $casts = [
        'json' => 'array'
    ];
}
