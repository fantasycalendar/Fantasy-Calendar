<?php

namespace App\Sharp;

use App\Models\Agreement;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\Fields\EntityListField;
use Code16\Sharp\EntityList\Fields\EntityListFieldsContainer;
use Code16\Sharp\EntityList\Fields\EntityListFieldsLayout;
use Code16\Sharp\EntityList\SharpEntityList;
use Illuminate\Contracts\Support\Arrayable;

class AgreementList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListFields(EntityListFieldsContainer $fieldsContainer): void
    {
        $fieldsContainer->addField(
            EntityListField::make('id')
                ->setLabel('ID')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('created_at')
                ->setLabel('Created At')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('updated_at')
                ->setLabel('Updated At')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('in_effect_at')
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

    public function buildListLayout(EntityListFieldsLayout $fieldsLayout): void
    {
        $fieldsLayout->addColumn('id', 2);
        $fieldsLayout->addColumn('created_at', 3);
        $fieldsLayout->addColumn('updated_at', 3);
        $fieldsLayout->addColumn('in_effect_at', 3);
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
            ->configureDefaultSort('in_effect_at', 'desc')
            ->configurePaginated();
    }

    /**
    * Retrieve all rows data as array.
    *
    * @param EntityListQueryParams $this->queryParams
    * @return array
    */
    public function getListData(): array|Arrayable
    {

        $agreement_model = Agreement::query();

        if($this->queryParams->sortedBy()) {
            $agreement_model->orderBy($this->queryParams->sortedBy(), $this->queryParams->sortedDir());
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
