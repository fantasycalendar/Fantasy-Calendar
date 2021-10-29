<?php

namespace App\Sharp;

use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class EnvVarsList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListDataContainers(): void
    {
        $this->addDataContainer(
            EntityListDataContainer::make('key')
                ->setLabel('Key')
                ->setSortable()
        )->addDataContainer(
            EntityListDataContainer::make('value')
                ->setLabel('Value')
                ->setSortable()
        );
    }

    /**
    * Build list layout using ->addColumn()
    *
    * @return void
    */
    public function buildListLayout(): void
    {
        $this->addColumn('key', 6, 12);
        $this->addColumn('value', 6, 12);
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
    public function getListData(EntityListQueryParams $params)
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
