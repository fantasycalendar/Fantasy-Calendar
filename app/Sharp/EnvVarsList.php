<?php

namespace App\Sharp;

use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\Fields\EntityListField;
use Code16\Sharp\EntityList\Fields\EntityListFieldsContainer;
use Code16\Sharp\EntityList\Fields\EntityListFieldsLayout;
use Code16\Sharp\EntityList\SharpEntityList;
use Illuminate\Contracts\Support\Arrayable;

class EnvVarsList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListFields(EntityListFieldsContainer $fieldsContainer): void
    {
        $fieldsContainer->addField(
            EntityListField::make('key')
                ->setLabel('Key')
                ->setSortable()
        )->addField(
            EntityListField::make('value')
                ->setLabel('Value')
                ->setSortable()
        );
    }

    /**
    * Build list layout using ->addColumn()
    *
    * @return void
    */
    public function buildListLayout(EntityListFieldsLayout $fieldsLayout): void
    {
        $fieldsLayout->addColumn('key', 6);
        $fieldsLayout->addColumn('value', 6);
    }

    /**
    * Build list config
    *
    * @return void
    */
    public function buildListConfig(): void
    {
        //
    }

	/**
	* Retrieve all rows data as array.
	*
	* @param EntityListQueryParams $params
	* @return array
	*/
    public function getListData(): array|Arrayable
    {
        $count = -1;
        $env = $_ENV;

        $vars = collect($env)->map(function($key, $value) use (&$count) {
            $count++;

            return [
                'value' => $key,
                'key' => $value,
                'id' => $count
            ];
        })->keyBy('id');

//        dd($vars);

        return $vars->toArray();
    }
}
