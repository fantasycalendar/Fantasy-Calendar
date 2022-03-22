<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_unauthenticated_error()
    {
        $response = $this->get('/api/v1/user');

        $response->assertStatus(200);

        $response->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_authenticated_success()
    {
        $user = Sanctum::actingAs(
            User::factory()->create(),
            ['*']
        );

        $response = $this->get('/api/v1/user');

        $response->assertStatus(200);
        $response->assertJson([
            "id" => $user->id,
            "username" => $user->username,
            "email" => $user->email,
        ]);
    }
}
