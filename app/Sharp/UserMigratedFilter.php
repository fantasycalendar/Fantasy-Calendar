<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\EntityListFilter;

class UserMigratedFilter implements EntityListFilter
{
    /**
    * @return array
    */
    public function values()
    {
        return ['migrated' => 'Yes'];
    }
    
    public function label()
    {
        return "Has Fully Migrated";
    }
}
