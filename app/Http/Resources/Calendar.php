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
        return [
            'username' => $this->user->username,
            'name' => $this->name,
            'hash' => $this->hash,
            'children' => $this->children,
            'master_hash' => $this->master_hash
        ];
    }
}
