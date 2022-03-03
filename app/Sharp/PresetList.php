<?php

namespace App\Sharp;

use App\Preset;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\Fields\EntityListField;
use Code16\Sharp\EntityList\Fields\EntityListFieldsContainer;
use Code16\Sharp\EntityList\Fields\EntityListFieldsLayout;
use Code16\Sharp\EntityList\SharpEntityList;
use Illuminate\Contracts\Support\Arrayable;

class PresetList extends SharpEntityList
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
            EntityListField::make('created_at')
                ->setLabel('Created At')
                ->setSortable()
                ->setHtml()
        )->addField(
            EntityListField::make('featured')
                ->setLabel('Featured')
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
            ->addColumn('created_at', 4)
            ->addColumn('featured', 2);
    }

    public function getInstanceCommands(): ?array
    {
        return [
            UpdatePreset::class,
            DeletePreset::class,
            FeaturePreset::class,
            UnfeaturePreset::class,
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
    * @return array
    */
    public function getListData(): array|Arrayable
    {
        $preset_model = Preset::query();

        if ($this->queryParams->hasSearch()) {
            foreach ($this->queryParams->searchWords() as $word) {
                $preset_model->where('name', 'like', $word);
            }
        }

        if($this->queryParams->sortedBy()) {
            $preset_model->orderBy($this->queryParams->sortedBy(), $this->queryParams->sortedDir());
        }

        return $this->setCustomTransformer(
            "created_at",
            function($created_at, $preset, $attribute) {
                return $preset->created_at;
            }
        )->setCustomTransformer(
            'featured',
            function($featured, $preset, $attribute) {
                return $featured ? "Yes" : "No";
            }
        )->transform($preset_model->paginate(20));
    }
}
