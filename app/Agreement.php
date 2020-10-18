<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agreement extends Model
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

        return sprintf("# Terms of Service\n\n*%s*\n\n%s", $this->updated_at->format('jS \\of F, Y'), $this->content);

    }
}
