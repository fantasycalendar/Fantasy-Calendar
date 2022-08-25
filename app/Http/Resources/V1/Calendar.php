<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;

class Calendar extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $parent_hash = false;
        $children = false;

        if($this->parent){
            $parent_hash = $this->parent->hash;
        }

        if($this->children != '[]'){
            $children = [];
            foreach($this->children as $child){
                $children[] = $child->hash;
            }
        }

        return [
            'name' => $this->name,
            'hash' => $this->hash,
            'parent_hash' => $parent_hash,
            'parent_link_type' => $this->parent_link_type,
            'parent_link_date' => $this->parent_link_date,
            'current_epoch' => $this->dynamic_data["epoch"],
            'children' => $children
        ];
    }
}
