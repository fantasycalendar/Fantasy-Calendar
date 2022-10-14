<?php

namespace Database\Seeders;

use App\Models\Agreement;
use Illuminate\Database\Seeder;

class AgreementsSeeder extends Seeder
{
    public function run()
    {
        Agreement::create([
            'content' => 'I agree to nothing!',
            'in_effect_at' => now()->subDay()
        ]);
    }
}
