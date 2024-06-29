<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property array $json
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog whereJson($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebhookLog whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
