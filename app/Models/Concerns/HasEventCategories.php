<?php

namespace App\Models\Concerns;

use App\EventCategory;

trait HasEventCategories
{
    public function getDefaultEventCategoryAttribute()
    {
        return EventCategory::find($this->setting('default_category'));
    }
}
