<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $domain
 * @property string $path
 * @property string $parameters
 * @property string $target
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest whereDomain($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest whereTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TrackedRequest whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
