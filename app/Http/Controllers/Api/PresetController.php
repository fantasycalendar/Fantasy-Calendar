<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Preset;

class PresetController extends Controller
{
    public function list(Request $request)
    {
        return Preset::all('id','name');
    }

    public function listHtml(Request $request)
    {
        return Preset::all('id','name')->map(function($preset){
            return sprintf('<option value="%s">%s</option>', $preset->id, $preset->name);
        })->implode('');
    }

    public function show(Request $request, $id)
    {
        return Preset::with(['events', 'categories'])->find($id);
    }
}