<?php

namespace App\Sharp;

use App\Agreement;
use Code16\Sharp\Show\Fields\SharpShowTextField;
use Code16\Sharp\Show\Layout\ShowLayoutColumn;
use Code16\Sharp\Show\Layout\ShowLayoutSection;
use Code16\Sharp\Show\SharpShow;
use Code16\Sharp\Utils\Transformers\Attributes\MarkdownAttributeTransformer;

class AgreementShow extends SharpShow
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
        $agreement = Agreement::findOrFail($id);

        return $this
            ->setCustomTransformer(
                "content", 
                new MarkdownAttributeTransformer()
            )->transform($agreement);
    }

    /**
     * Build show fields using ->addField()
     *
     * @return void
     */
    public function buildShowFields()
    {
         $this->addField(
            SharpShowTextField::make("content")
        );
    }

    /**
     * Build show layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildShowLayout()
    {
         $this->addSection('content', function(ShowLayoutSection $section) {
              $section->addColumn(12, function(ShowLayoutColumn $column) {
                  $column->withSingleField("content");
              });
         });
    }

    function buildShowConfig()
    {
        //
    }
}
