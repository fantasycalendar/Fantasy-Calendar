<?php

namespace App\Sharp;

use App\Policy;
use Code16\Sharp\Form\Eloquent\WithSharpFormEloquentUpdater;
use Code16\Sharp\Form\Fields\SharpFormDateField;
use Code16\Sharp\Form\Fields\SharpFormMarkdownField;
use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Form\SharpForm;

class PolicyForm extends SharpForm
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
            Policy::findOrFail($id)
        );
    }

    /**
     * @param $id
     * @param array $data
     * @return mixed the instance id
     */
    public function update($id, array $data)
    {
        $policy = $id ? Policy::findOrFail($id) : new Policy;
        $this->save($policy, $data);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        Policy::findOrFail($id)->find($id)->delete();
    }

    /**
     * Build form fields using ->addField()
     *
     * @return void
     */
    public function buildFormFields()
    {
        $this->addField(
            SharpFormMarkdownField::make('content')
                ->setLabel('Content')
        )->addField(
            SharpFormDateField::make('in_effect_at')
                ->setLabel('In Effect At')
        );
    }

    /**
     * Build form layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildFormLayout()
    {
        $this->addColumn(9, function(FormLayoutColumn $column) {
            $column->withSingleField('content');
        })->addColumn(3, function(FormLayoutColumn $column) {
            $column->withSingleField('in_effect_at');
        });
    }
}