<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property int $calendar_id
 * @property array $category_settings
 * @property array $event_settings
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $sort_by
 * @property-read \App\Models\Calendar|null $calendar
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereCalendarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereCategorySettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereEventSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereSortBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|EventCategory withoutTrashed()
 * @mixin \Eloquent
 */
class EventCategory extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'calendar_id',
        'sort_by',
    ];

    protected $hidden = ['deleted_at', 'calendar'];

    protected $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];

    public function calendar() {
        return $this->belongsTo(Calendar::class);
    }

    /**
     * Prepare a date for array / JSON serialization
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
