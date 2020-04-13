<?php

namespace App\Http\Resources;

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

        if($this->parent){
            $parent_hash = $this->parent->hash;
        }else{
            $parent_hash = false;
        }

        if($this->children != '[]'){
            $children = [];
            foreach($this->children as $child){
                $children[] = $child->hash;
            }
        }else{
            $children = false;
        }

        return [
            'name' => $this->name,
            'hash' => $this->hash,
            'parent_hash' => $parent_hash,
            'parent_link_date' => $this->parent_link_date,
            'children' => $children
        ];
    }
}
