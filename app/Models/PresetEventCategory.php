<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property int $preset_id
 * @property array $category_settings
 * @property array $event_settings
 * @property string $label
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereCategorySettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereEventSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory wherePresetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PresetEventCategory whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PresetEventCategory extends Model
{
    public $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'preset_id',
        'label'
    ];


    protected $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];
}
