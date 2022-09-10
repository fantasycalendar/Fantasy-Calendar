<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Calendar extends Model
{
    use HasFactory;

    /**
     * Used internally by laravel to bind hash->calendar in routes
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'hash';
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function event_categories(): HasMany
    {
        return $this->hasMany(EventCategory::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'calendar_user_role')->withPivot('user_role');
    }
}
