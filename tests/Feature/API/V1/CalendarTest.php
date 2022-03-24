<?php
//
//namespace Tests\Feature\API\V1;
//
//use App\Models\Calendar;
//use App\Models\User;
//use Laravel\Sanctum\Sanctum;
//
//class CalendarTest extends TestCase
//{
//    /**
//     * A basic feature test example.
//     *
//     * @return void
//     */
//    public function test_load_calendars_list()
//    {
//        Sanctum::actingAs(
//            User::factory()->has(Calendar::factory()->count(3))->create(),
//            ['*']
//        );
//
//        $response = $this->get($this->apiUrl('/calendar'));
//
//        $response->assertStatus(200);
//        $response->assertJsonCount(3);
//    }
//}
