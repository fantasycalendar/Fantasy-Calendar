<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $in_effect_at
 * @method static \Illuminate\Database\Eloquent\Builder|Policy newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Policy newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Policy query()
 * @method static \Illuminate\Database\Eloquent\Builder|Policy whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Policy whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Policy whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Policy whereInEffectAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Policy whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Policy extends Model
{
    use HasFactory;

    public $fillable = [
        'content',
        'in_effect_at'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'in_effect_at' => 'datetime'
    ];

    public static function current() {
        return static::where("in_effect_at", "<=", now())->latest()->first();
    }
}
