<?php

namespace App\Sharp;

use App\Agreement;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class AgreementList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListDataContainers(): void
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

    public function buildListLayout(): void
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
    public function buildListConfig(): void
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

        $agreement_model = Agreement::query();

        if($params->sortedBy()) {
            $agreement_model->orderBy($params->sortedBy(), $params->sortedDir());
        }

        return $this->setCustomTransformer(
            "created_at",
            function($created_at, $agreement, $attribute) {
                return $agreement->created_at->toDateString();
            }
        )->setCustomTransformer(
            "updated_at",
            function($created_at, $agreement, $attribute) {
                return $agreement->created_at->toDateString();
            }
        )->setCustomTransformer(
            "in_effect_at",
            function($created_at, $agreement, $attribute) {
                return $agreement->created_at->toDateString();
            }
        )->transform($agreement_model->paginate(20));
    }
}
