<?php

namespace App\Sharp;

use Code16\Sharp\Utils\Filters\SelectMultipleFilter;

class UserMigratedFilter extends SelectMultipleFilter
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
