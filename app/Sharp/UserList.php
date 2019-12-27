<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\Containers\EntityListDataContainer;
use Code16\Sharp\EntityList\EntityListQueryParams;
use Code16\Sharp\EntityList\SharpEntityList;

class UserList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListDataContainers()
    {
        $this->addDataContainer(
            EntityListDataContainer::make('username')
                ->setLabel('Username')
                ->setSortable()
        )->addDataContainer(
            EntityListDataContainer::make('email')
                ->setLabel('Email Address')
                ->setSortable()
        )->addDataContainer(
            EntityListDataContainer::make('permissions')
                ->setLabel('User permissions')
        )->addDataContainer(
            EntityListDataContainer::make('beta_authorised')
                ->setLabel('Beta Access')
                ->setSortable()
        )->addDataContainer(
            EntityListDataContainer::make('created_at')
                ->setLabel('Created At')
                ->setSortable()
        );
    }

    /**
    * Build list layout using ->addColumn()
    *
    * @return void
    */

    public function buildListLayout()
    {
        $this->addColumn('username', 2, 6);
        $this->addColumn('email', 3, 6);
        $this->addColumn('permissions', 1, 6);
        $this->addColumn('beta_authorised', 1,6);
        $this->addColumn('created_at', 2,6);
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
        $user_model = new User();

        return $this->setCustomTransformer(
            "beta_authorised",
            function($beta_authorized, $user, $attribute) {
                return ($beta_authorized ? "Yes" : "No");
            }
        )->transform($user_model->paginate(20));
    }
}
