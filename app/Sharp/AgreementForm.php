<?php

namespace App\Sharp;

use App\Agreement;
use Code16\Sharp\Form\Eloquent\WithSharpFormEloquentUpdater;
use Code16\Sharp\Form\Fields\SharpFormDateField;
use Code16\Sharp\Form\Fields\SharpFormMarkdownField;
use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Form\SharpForm;

class AgreementForm extends SharpForm
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
            Agreement::findOrFail($id)
        );
    }

    /**
     * @param $id
     * @param array $data
     * @return mixed the instance id
     */
    public function update($id, array $data): mixed
    {
        $agreement = $id ? Agreement::findOrFail($id) : new Agreement;
        $this->save($agreement, $data);

        return $id;
    }

    /**
     * @param $id
     */
    public function delete($id): void
    {
        Agreement::findOrFail($id)->find($id)->delete();
    }

    /**
     * Build form fields using ->addField()
     *
     * @return void
     */
    public function buildFormFields(FieldsContainer $formFields): void
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
    public function buildFormLayout(FormLayout $formLayout): void
    {
        $this->addColumn(9, function(FormLayoutColumn $column) {
            $column->withSingleField('content');
        })->addColumn(3, function(FormLayoutColumn $column) {
            $column->withSingleField('in_effect_at');
        });
    }
}
