<?php

namespace App\Sharp;

use App\Preset;
use Code16\Sharp\Form\Fields\SharpFormTextField;
use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Form\SharpForm;

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
    public function update($id, array $data)
    {
        return Preset::find($id)->update($data);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        return Preset::find($id)->delete();
    }

    /**
     * Build form fields using ->addField()
     *
     * @return void
     */
    public function buildFormFields()
    {
        $this->addField(
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
    public function buildFormLayout()
    {
        $this->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('name');
        })->addColumn(6, function(FormLayoutColumn $column) {
            $column->withSingleField('description');
        });
    }
}
