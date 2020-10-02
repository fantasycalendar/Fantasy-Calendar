<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarInvitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_invites', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('invite_token');
            $table->string('email');
            $table->bigInteger('calendar_id');
            $table->boolean('accepted')->default(false);
            $table->timestamp('expires_on');
            $table->timestamp('resent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendar_invites');
    }
}
