<?php

namespace App\Sharp;

use App\Preset;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class PresetList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListDataContainers()
    {
        $this->addDataContainer(
            EntityListDataContainer::make('name')
                ->setLabel('Name')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('created_at')
                ->setLabel('Created At')
                ->setSortable()
                ->setHtml()
        )->addDataContainer(
            EntityListDataContainer::make('featured')
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

    public function buildListLayout()
    {
        $this->addColumn('name', 4)
            ->addColumn('created_at', 4)
            ->addColumn('featured', 2);
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
            ->setDefaultSort('name', 'asc')
            ->setPaginated()
            ->addInstanceCommand("update", UpdatePreset::class)
            ->addInstanceCommand("delete", DeletePreset::class)
            ->addInstanceCommand("feature", FeaturePreset::class)
            ->addInstanceCommand("unfeature", UnfeaturePreset::class);
    }

    /**
    * Retrieve all rows data as array.
    *
    * @param EntityListQueryParams $params
    * @return array
    */
    public function getListData(EntityListQueryParams $params)
    {

        $preset_model = Preset::query();

        if ($params->hasSearch()) {
            foreach ($params->searchWords() as $word) {
                $preset_model->where('name', 'like', $word);
            }
        }

        if($params->sortedBy()) {
            $preset_model->orderBy($params->sortedBy(), $params->sortedDir());
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
