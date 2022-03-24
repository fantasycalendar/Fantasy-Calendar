<?php

namespace App\Sharp;

use Code16\Sharp\Show\Fields\SharpShowTextField;
use Code16\Sharp\Show\Layout\ShowLayout;
use Code16\Sharp\Show\Layout\ShowLayoutColumn;
use Code16\Sharp\Show\Layout\ShowLayoutSection;
use Code16\Sharp\Show\SharpShow;

use App\Models\Preset;
use Code16\Sharp\Utils\Fields\FieldsContainer;

class PresetShow extends SharpShow
{
    /**
     * Retrieve a Model for the form and pack all its data as JSON.
     *
     * @param $id
     * @return array
     */
    public function find($id): array
    {
        // Replace/complete this code
        $preset = Preset::findOrFail($id);

        return $this->transform($preset);
    }

    /**
     * Build show fields using ->addField()
     *
     * @return void
     */
    public function buildShowFields(FieldsContainer $showFields): void
    {
         $showFields->addField(
            SharpShowTextField::make("name")
                ->setLabel("Name:")
        )->addField(
            SharpShowTextField::make("description")
       );
    }

    /**
     * Build show layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildShowLayout(ShowLayout $showLayout): void
    {

        $showLayout->addSection('Calendar Info', function(ShowLayoutSection $section) {
            $section->addColumn(6, function(ShowLayoutColumn $column) {
                $column->withSingleField("name");
            });
        })->addSection('Description', function(ShowLayoutSection $section) {
            $section->addColumn(12, function(ShowLayoutColumn $column) {
                $column->withSingleField("description");
            });
        });
    }

    function buildShowConfig(): void
    {
        //
    }
}
