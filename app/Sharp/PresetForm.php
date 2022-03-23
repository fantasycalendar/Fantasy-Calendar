<?php

namespace App\Sharp;

use App\Models\Preset;
use Code16\Sharp\Form\Fields\SharpFormTextField;
use Code16\Sharp\Form\Layout\FormLayout;
use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Form\SharpForm;
use Code16\Sharp\Utils\Fields\FieldsContainer;

class PresetForm extends SharpForm
{
    /**
     * Retrieve a Model for the form and pack all its data as JSON.
     *
     * @param $id
     * @return array
     */
    public function find($id): array
    {
        return Preset::find($id)->toArray();
    }

    /**
     * @param $id
     * @param array $data
     * @return mixed the instance id
     */
    public function update($id, array $data): mixed
    {
        return Preset::find($id)->update($data);
    }

    /**
     * @param $id
     */
    public function delete($id): void
    {
        Preset::find($id)->delete();
    }

    /**
     * Build form fields using ->addField()
     *
     * @return void
     */
    public function buildFormFields(FieldsContainer $formFields): void
    {
        $formFields->addField(
            SharpFormTextField::make('name')
                ->setLabel('name')
        )->addField(
            SharpFormTextField::make('description')
                ->setLabel('Description')
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
            $column->withSingleField('name');
        })->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('description');
        });
    }
}
