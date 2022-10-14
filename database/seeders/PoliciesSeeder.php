<?php

namespace Database\Seeders;

use App\Models\Policy;
use Illuminate\Database\Seeder;

class PoliciesSeeder extends Seeder
{
    public function run()
    {
        Policy::create([
            'content' => "Seeders are for development environments, which means there is no policy!",
            'in_effect_at' => now()->subDay()
        ]);
    }
}
