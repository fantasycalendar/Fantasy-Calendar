<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\Fields\EntityListField;
use Code16\Sharp\EntityList\Fields\EntityListFieldsContainer;
use Code16\Sharp\EntityList\Fields\EntityListFieldsLayout;
use Code16\Sharp\EntityList\SharpEntityList;
use Illuminate\Contracts\Support\Arrayable;

class UserList extends SharpEntityList
{
    /**
    * Build list containers using ->addDataContainer()
    *
    * @return void
    */
    public function buildListFields(EntityListFieldsContainer $fieldsContainer): void
    {
        $fieldsContainer->addField(
            EntityListField::make('username')
                ->setLabel('Username')
                ->setSortable()
        )->addField(
            EntityListField::make('email')
                ->setLabel('Email Address')
                ->setSortable()
        )->addField(
            EntityListField::make('permissions')
                ->setLabel('User permissions')
        )->addField(
            EntityListField::make('beta_authorised')
                ->setLabel('Beta Access')
                ->setSortable()
        )->addField(
            EntityListField::make('created_at')
                ->setLabel('Created At')
                ->setSortable()
        )->addField(
            EntityListField::make('email_verified_at')
                ->setLabel("Email verified")
        );
    }

    /**
    * Build list layout using ->addColumn()
    *
    * @return void
    */

    public function buildListLayout(EntityListFieldsLayout $fieldsLayout): void
    {
        $fieldsLayout->addColumn('username', 2)
                     ->addColumn('email', 4)
                     ->addColumn('permissions', 1)
                     ->addColumn('beta_authorised', 1)
                     ->addColumn('created_at', 2)
                     ->addColumn('email_verified_at', 2);
    }

    public function getInstanceCommands(): ?array
    {
        return [
            LoginAsUser::class,
            SendUserResetPassword::class,
        ];
    }

    public function getFilters(): ?array
    {
        return [
            UserMigratedFilter::class,
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
            ->configureDefaultSort('created_at', 'desc')
            ->configurePaginated();
    }

    /**
    * Retrieve all rows data as array.
    *
    * @return array
    */
    public function getListData(): array|Arrayable
    {
        $user_model = User::query();

        if ($this->queryParams->hasSearch()) {
            foreach ($this->queryParams->searchWords() as $word) {
                $user_model->where('username', 'like', $word)
                        ->orWhere('email', 'like', $word);
            }
        }

        if($this->queryParams->filterFor("migrated")) {
            $user_model->whereNotNull('agreed_at');
        }

        if($this->queryParams->sortedBy()) {
            $user_model->orderBy($this->queryParams->sortedBy(), $this->queryParams->sortedDir());
        }

        return $this->setCustomTransformer(
            "beta_authorised",
            function($beta_authorized, $user, $attribute) {
                return ($beta_authorized ? "Yes" : "No");
            }
        )->setCustomTransformer(
            "permissions",
            function($permissions, $user, $attribute) {
                return ($permissions == 1 ? "Admin" : "User");
            }
        )->setCustomTransformer(
            "created_at",
            function($created_at, $user, $attribute) {
                return $user->created_at;
            }
        )->transform($user_model->paginate(20));
    }
}
