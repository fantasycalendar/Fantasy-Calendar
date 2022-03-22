<?php

namespace App\Sharp;

use App\Models\User;
use Code16\Sharp\Form\Eloquent\WithSharpFormEloquentUpdater;
use Code16\Sharp\Form\Fields\SharpFormCheckField;
use Code16\Sharp\Form\Fields\SharpFormDateField;
use Code16\Sharp\Form\Fields\SharpFormTextField;
use Code16\Sharp\Form\Layout\FormLayout;
use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Form\SharpForm;
use Code16\Sharp\Utils\Fields\FieldsContainer;

class UserForm extends SharpForm
{
    use WithSharpFormEloquentUpdater;

    /**
     * Retrieve a Model for the form and pack all its data as JSON.
     *
     * @param $id
     * @return array
     */
    public function find($id): array
    {
        return $this->transform(
            User::findOrFail($id)
        );
    }

    /**
     * @param $id
     * @param array $data
     * @return mixed the instance id
     */
    public function update($id, array $data)
    {
        $user = $id ? User::findOrFail($id) : new User;
        $this->save($user, $data);
    }

    /**
     * @param $id
     */
    public function delete($id): void
    {
        User::findOrFail($id)->find($id)->delete();
    }

    /**
     * Build form fields using ->addField()
     *
     * @return void
     */
    public function buildFormFields(FieldsContainer $formFields): void
    {
        $formFields->addField(
            SharpFormTextField::make('username')
                ->setLabel('Username')
        )->addField(
            SharpFormTextField::make('email')
                ->setLabel('Email')
        )->addField(
            SharpFormDateField::make('created_at')
                ->setLabel('Created Date')
        )->addField(
            SharpFormCheckField::make('beta_authorised', "Beta Authorised")
        );
    }

    /**
     * Build form layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildFormLayout(FormLayout $formLayout): void
    {
        $formLayout->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('username');
        })->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('email');
        })->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('created_at');
        })->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('beta_authorised');
        });
    }
}
