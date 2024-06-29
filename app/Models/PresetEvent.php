<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property array $data
 * @property string $description
 * @property int|null $preset_event_category_id
 * @property string $event_category_id
 * @property int $preset_id
 * @property array $settings
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereEventCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent wherePresetEventCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent wherePresetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEvent whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PresetEvent extends Model
{

    public $fillable = [
        'name',
        'preset_id',
        'event_category_id',
        'preset_event_category_id',
        'description',
        'data',
        'settings',
    ];

    public $hidden = [
        'id'
    ];

    protected $casts = [
        'data' => 'array',
        'settings' => 'array',
    ];
}
