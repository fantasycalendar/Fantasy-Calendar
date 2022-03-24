<?php

namespace App\Sharp;

use App\Models\Calendar;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class UserCalendarList extends CalendarList
{
    /**
    * Retrieve all rows data as array.
    *
    * @param EntityListQueryParams $params
    * @return array
    */
    public function getListData(EntityListQueryParams $params)
    {
        return $this->transform(Calendar::where('user_id', $params->filterFor('user'))->paginate(10));
    }
}
