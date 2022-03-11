<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Preset;

class PresetController extends Controller
{
    public function list(Request $request)
    {
        return Preset::orderBy('name')->get()->map(function($preset){
            return [
                'id' => $preset->id,
                'name' => $preset->name,
                'description' => $preset->description,
                'author' => $preset->creator->username,
                'featured' => $preset->featured
            ];
        });
    }

    public function show(Request $request, $id)
    {
        return Preset::with(['events', 'categories'])->find($id);
    }
}
