<?php

namespace App\Sharp;

use App\Policy;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class PolicyList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListDataContainers()
    {
        $this->addDataContainer(
            EntityListDataContainer::make('id')
                ->setLabel('ID')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('created_at')
                ->setLabel('Created At')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('updated_at')
                ->setLabel('Updated At')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('in_effect_at')
                ->setLabel('In Effect At')
                ->setSortable()
                ->setHtml()
        );
    }

    /**
    * Build list layout using ->addColumn()
    *
    * @return void
    */

    public function buildListLayout()
    {
        $this->addColumn('id', 2,6);
        $this->addColumn('created_at', 3,6);
        $this->addColumn('updated_at', 3,6);
        $this->addColumn('in_effect_at', 3,6);
    }

    /**
    * Build list config
    *
    * @return void
    */
    public function buildListConfig()
    {
        $this->setInstanceIdAttribute('id')
            ->setSearchable()
            ->setDefaultSort('in_effect_at', 'desc')
            ->setPaginated();
    }

    /**
    * Retrieve all rows data as array.
    *
    * @param EntityListQueryParams $params
    * @return array
    */
    public function getListData(EntityListQueryParams $params)
    {

        $policy_model = Policy::query();
        
        if($params->sortedBy()) {
            $policy_model->orderBy($params->sortedBy(), $params->sortedDir());
        }

        return $this->setCustomTransformer(
            "created_at",
            function($created_at, $policy, $attribute) {
                return $policy->created_at->toDateString();
            }
        )->setCustomTransformer(
            "updated_at",
            function($created_at, $policy, $attribute) {
                return $policy->created_at->toDateString();
            }
        )->setCustomTransformer(
            "in_effect_at",
            function($created_at, $policy, $attribute) {
                return $policy->created_at->toDateString();
            }
        )->transform($policy_model->paginate(20));
    }
}
