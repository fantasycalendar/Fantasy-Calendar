<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int|null $source_calendar_id
 * @property int|null $creator_id
 * @property string $name
 * @property string $description
 * @property array $dynamic_data
 * @property array $static_data
 * @property int $featured
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PresetEventCategory> $categories
 * @property-read int|null $categories_count
 * @property-read \App\Models\User|null $creator
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PresetEvent> $events
 * @property-read int|null $events_count
 * @property-read \App\Models\Calendar|null $source
 * @method static \Illuminate\Database\Eloquent\Builder|Preset newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Preset newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Preset onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Preset query()
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereDynamicData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereSourceCalendarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereStaticData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Preset withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Preset withoutTrashed()
 * @mixin \Eloquent
 */
class Preset extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'dynamic_data',
        'static_data',
        'description',
        'source_calendar_id',
        'creator_id',
        'featured',
    ];

    protected $casts = [
        'dynamic_data' => 'array',
        'static_data' => 'array',
    ];

    public function events()
    {
        return $this->hasMany(PresetEvent::class);
    }

    public function categories()
    {
        return $this->hasMany(PresetEventCategory::class);
    }

    public function source()
    {
        return $this->belongsTo(Calendar::class, 'source_calendar_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function feature()
    {
        $this->featured = true;
        $this->save();
    }

    public function unFeature()
    {
        $this->featured = false;
        $this->save();
    }
}
