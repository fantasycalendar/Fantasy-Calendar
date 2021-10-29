<?php

namespace App\Sharp;

use App\Calendar;
use Code16\Sharp\Show\Fields\SharpShowTextField;
use Code16\Sharp\Show\Layout\ShowLayoutColumn;
use Code16\Sharp\Show\Layout\ShowLayoutSection;
use Code16\Sharp\Show\SharpShow;

class CalendarShow extends SharpShow
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
        $calendar = Calendar::findOrFail($id);

        return $this->setCustomTransformer(
            "owner",
            function($owner, $calendar, $attribute) {
                return $calendar->user->username;
            }
        )->transform($calendar);
    }

    /**
     * Build show fields using ->addField()
     *
     * @return void
     */
    public function buildShowFields(): void
    {
        $this->addField(
            SharpShowTextField::make("name")
                ->setLabel("Name:")
        )->addField(
             SharpShowTextField::make("owner")
                 ->setLabel("Owner:")
        )->addField(
             SharpShowTextField::make("dynamic_data")
        )->addField(
             SharpShowTextField::make("static_data")
        );
    }

    /**
     * Build show layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildShowLayout(): void
    {
        $this->addSection('Calendar Info', function(ShowLayoutSection $section) {
            $section->addColumn(6, function(ShowLayoutColumn $column) {
                $column->withSingleField("name");
            })->addColumn(6, function(ShowLayoutColumn $column) {
                $column->withSingleField("owner");
            });
        })->addSection('Dynamic Data', function(ShowLayoutSection $section) {
            $section->addColumn(12, function(ShowLayoutColumn $column) {
                $column->withSingleField("dynamic_data");
            });
        })->addSection('Static Data', function(ShowLayoutSection $section) {
            $section->addColumn(12, function(ShowLayoutColumn $column) {
                $column->withSingleField("static_data");
            });
        });
    }

    function buildShowConfig(): void
    {
        //
    }
}
