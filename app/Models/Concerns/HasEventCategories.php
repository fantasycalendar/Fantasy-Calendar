<?php

namespace App\Models\Concerns;

use App\Models\EventCategory;

trait HasEventCategories
{
    public function getDefaultEventCategoryAttribute()
    {
        return EventCategory::find($this->setting('default_category'));
    }
}
