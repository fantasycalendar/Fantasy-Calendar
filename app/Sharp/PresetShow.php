<?php

namespace App\Sharp;

use Code16\Sharp\Form\Layout\FormLayoutColumn;
use Code16\Sharp\Show\Fields\SharpShowTextField;
use Code16\Sharp\Show\Layout\ShowLayoutSection;
use Code16\Sharp\Show\SharpSingleShow;

class PresetShow extends SharpSingleShow
{
    /**
     * Retrieve a Model for the form and pack all its data as JSON.
     *
     * @return array
     */
    public function findSingle(): array
    {
        // Replace/complete this code
        $preset = Preset::findOrFail(1);

        return $this->transform($preset);
    }

    /**
     * Build show fields using ->addField()
     *
     * @return void
     */
    public function buildShowFields()
    {
         $this->addField(
            SharpShowTextField::make("name")
                ->setLabel("Name:")
        );
    }

    /**
     * Build show layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildShowLayout()
    {
         $this->addSection('Section', function(ShowLayoutSection $section) {
              $section->addColumn(6, function(FormLayoutColumn $column) {
                  $column->withSingleField("name");
              });
         });
    }

    function buildShowConfig()
    {
        //
    }
}
