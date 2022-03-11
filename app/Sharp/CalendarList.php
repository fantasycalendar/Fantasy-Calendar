<?php

namespace App\Sharp;

use Carbon\Carbon;
use App\Calendar;
use App\User;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\Fields\EntityListField;
use Code16\Sharp\EntityList\Fields\EntityListFieldsContainer;
use Code16\Sharp\EntityList\Fields\EntityListFieldsLayout;
use Code16\Sharp\EntityList\SharpEntityList;
use Illuminate\Contracts\Support\Arrayable;

class CalendarList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListFields(EntityListFieldsContainer $fieldsContainer): void
    {
        $fieldsContainer->addField(
            EntityListField::make('name')
                ->setLabel('Name')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('user')
                ->setLabel('Owner')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('events')
                ->setLabel('Events')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('date_created')
                ->setLabel('Created At')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('last_updated')
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

    public function buildListLayout(EntityListFieldsLayout $fieldsLayout): void
    {
        $fieldsLayout->addColumn('name', 4)
            ->addColumn('user', 2)
            ->addColumn('events', 2)
            ->addColumn('date_created', 2)
            ->addColumn('last_updated', 2);
    }

    protected function getInstanceCommands(): ?array
    {
        return [
            EditCalendar::class,
            ViewCalendar::class,
            VisitExport::class,
            PromoteToPreset::class,
        ];
    }

    /**
    * Build list config
    *
    * @return void
    */
    public function buildListConfig(): void
    {
        $this->configureInstanceIdAttribute('id')
            ->configureSearchable()
            ->configureDefaultSort('name', 'asc')
            ->configurePaginated();
    }

    /**
     * Retrieve all rows data as array.
     *
     * @return array|Arrayable
     */
    public function getListData(): array|Arrayable
    {

        $calendar_model = Calendar::query();

        if ($this->queryParams->hasSearch()) {
            foreach ($this->queryParams->searchWords() as $word) {
                $calendar_model->where('name', 'like', $word);
            }
        }

        if($user_id = $this->queryParams->filterFor('user')) {
            $calendar_model->where('user_id', $user_id);
        }

        if($this->queryParams->sortedBy()) {
            $calendar_model->orderBy($this->queryParams->sortedBy(), $this->queryParams->sortedDir());
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
