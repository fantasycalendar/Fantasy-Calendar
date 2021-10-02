<?php

namespace Database\Seeders;

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $admin = User::create([
            'username' => 'Admin',
            'email' => 'test@example.com',
            'password' => Hash::make('Password1'),
            'permissions' => 1,
            'reg_ip' => '127.0.0.1',
            'agreement_id' => 1,
            'agreed_at' => now(),
            'policy_id' => 1,
            'beta_authorised' => 1,
            'acknowledged_migration' => 1,
            'settings' => [
                'dark_theme' => 1,
            ],
        ]);

        $admin->email_verified_at = now()->subDay();
        $admin->save();
    }
}
