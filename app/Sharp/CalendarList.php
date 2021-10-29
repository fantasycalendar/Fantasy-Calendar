<?php

namespace App\Sharp;

use Carbon\Carbon;
use App\Calendar;
use App\User;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class CalendarList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListDataContainers(): void
    {
        $this->addDataContainer(
            EntityListDataContainer::make('name')
                ->setLabel('Name')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('user')
                ->setLabel('Owner')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('events')
                ->setLabel('Events')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('date_created')
                ->setLabel('Created At')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('last_updated')
                ->setLabel('Last Updated')
                ->setSortable()
                ->setHtml()
        );
    }

    /**
    * Build list layout using ->addColumn()
    *
    * @return void
    */

    public function buildListLayout(): void
    {
        $this->addColumn('name', 4)
            ->addColumn('user', 2)
            ->addColumn('events', 2)
            ->addColumn('date_created', 2)
            ->addColumn('last_updated', 2);
    }

    /**
    * Build list config
    *
    * @return void
    */
    public function buildListConfig(): void
    {
        $this->setInstanceIdAttribute('id')
            ->setSearchable()
            ->setDefaultSort('name', 'asc')
            ->setPaginated()
            ->addInstanceCommand("edit", EditCalendar::class)
            ->addInstanceCommand("view", ViewCalendar::class)
            ->addInstanceCommand("export", VisitExport::class)
            ->addInstanceCommand("promote", PromoteToPreset::class)
            ->addInstanceCommand("reconvert", ReconvertFromLegacy::class);
    }

    /**
    * Retrieve all rows data as array.
    *
    * @param EntityListQueryParams $params
    * @return array
    */
    public function getListData(EntityListQueryParams $params)
    {

        $calendar_model = Calendar::query();

        if ($params->hasSearch()) {
            foreach ($params->searchWords() as $word) {
                $calendar_model->where('name', 'like', $word);
            }
        }

        if($user_id = $params->filterFor('user')) {
            $calendar_model->where('user_id', $user_id);
        }

        if($params->sortedBy()) {
            $calendar_model->orderBy($params->sortedBy(), $params->sortedDir());
        }

        return $this->setCustomTransformer(
            "user",
            function($user, $calendar, $attribute) {
                return $calendar->user->username;
            }
        )->setCustomTransformer(
            "date_created",
            function($date_created, $calendar, $attribute) {
                return $calendar->date_created;
            }
        )->setCustomTransformer(
            "events",
            function($events, $calendar, $attribute) {
                return $calendar->events->count();
            }
        )->setCustomTransformer(
            "last_updated",
            function($last_updated, $calendar, $attribute) {
                $dynamic_change = new Carbon($calendar->last_dynamic_change);
                $static_change = new Carbon($calendar->last_static_change);
                $last_updated_date = $dynamic_change >= $static_change ? $calendar->last_dynamic_change : $calendar->last_static_change;
                return $last_updated_date;
            }
        )->transform($calendar_model->paginate(20));

    }
}
