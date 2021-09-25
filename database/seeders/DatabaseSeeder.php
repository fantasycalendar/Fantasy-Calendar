<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(PoliciesSeeder::class);
        $this->call(AgreementsSeeder::class);
        $this->call(UsersSeeder::class);
        $this->call(PresetsSeeder::class);
    }
}
