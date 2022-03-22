<?php

namespace Tests\Feature\API\V1;

use App\Models\User;
use Laravel\Sanctum\Sanctum;

class UserTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_unauthenticated_error()
    {
        $response = $this->get($this->apiUrl('user'));

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

        $response = $this->get($this->apiUrl('user'));

        $response->assertStatus(200);
        $response->assertJson([
            "id" => $user->id,
            "username" => $user->username,
            "email" => $user->email,
        ]);
    }

    public function test_login_successfully()
    {
        $user = User::factory()->create();

        $response = $this->post($this->apiUrl('user/login'), [
            'identity' => $user->username,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'username' => $user->username,
            'api_token' => "afakeapitoken{$user->username}"
        ]);
    }

    public function test_incorrect_password_401()
    {
        $user = User::factory()->create();

        $response = $this->post($this->apiUrl('user/login'), [
            'identity' => $user->username,
            'password' => 'nottherightpassword',
        ]);

        $response->assertStatus(401);
    }
}
