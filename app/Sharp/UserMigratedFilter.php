<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\EntityListSelectMultipleFilter;

class UserMigratedFilter implements EntityListSelectMultipleFilter
{
    /**
    * @return array
    */
    public function values(): array
    {
        return ['migrated' => 'Yes'];
    }

    public function label(): string
    {
        return "Has Fully Migrated";
    }
}
