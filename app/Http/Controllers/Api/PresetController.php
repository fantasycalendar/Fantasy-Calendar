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

    public function show(Request $request, $id)
    {
        return Preset::with(['events', 'categories'])->find($id);
    }
}