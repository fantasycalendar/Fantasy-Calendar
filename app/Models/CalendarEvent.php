<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Mews\Purifier\Casts\CleanHtml;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property array $data
 * @property array $description
 * @property int|null $event_category_id
 * @property int $calendar_id
 * @property array $settings
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $sort_by
 * @property int $creator_id
 * @property-read \App\Models\Calendar|null $calendar
 * @property-read \App\Models\EventCategory|null $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CalendarEventComment> $comments
 * @property-read int|null $comments_count
 * @property-read \App\Models\User|null $creator
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereCalendarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereEventCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereSortBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent withoutTrashed()
 * @mixin \Eloquent
 */
class CalendarEvent extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'calendar_id',
        'creator_id',
        'event_category_id',
        'description',
        'data',
        'settings',
        'sort_by',
    ];

    protected $hidden = ['deleted_at', 'category', 'calendar'];

    protected $casts = [
        'data' => 'array',
        'settings' => 'array',
        'description' => CleanHtml::class,
    ];

    public function category() {
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }

    public function calendar() {
        return $this->belongsTo(Calendar::class);
    }

    public function comments() {
        return $this->hasMany(CalendarEventComment::class, 'event_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function getCreatorIdAttribute($value) {
        return $value ?? $this->calendar->user->id;
    }

    public function detail($key)
    {
        return Arr::get($this->data, $key);
    }

    public function setting($settingName, $default = false) {
        if(is_array($this->settings) && Arr::has($this->settings, $settingName)) {
            return Arr::get($this->settings, $settingName, $default);
        }

        return false;
    }

    public function getDescriptionAttribute($value) {
        return html_entity_decode($value);
    }

    public function oneTime($year, $month, $day)
    {
        $this->data = [
            'has_duration' => false,
            'duration' => 1,
            'show_first_last' => false,
            'limited_repeat' => false,
            'limited_repeat_num' => 1,
            'conditions' => [
                [
                    "Date",
                    "0",
                    [
                        $year,
                        $month,
                        $day
                    ]
                ]
            ],
            'connected_events' => [],
            'date' => [
                $year,
                $month,
                $day
            ],
            'search_distance' => 0,
            'overrides' => [
                'moons' => []
            ]
        ];
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
