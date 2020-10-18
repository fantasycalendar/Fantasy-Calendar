<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    use HasFactory;

    public $fillable = [
        'content'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'in_effect_at' => 'datetime'
    ];

    /**
     * @return string
     */
    public function markdown(){

        return sprintf("# Privacy Policy\n\n*Last updated: %s*\n\n%s", $this->in_effect_at->format('jS \\of F, Y'), $this->content);

    }
}