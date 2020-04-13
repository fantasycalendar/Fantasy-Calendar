<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCalendarsBetaLinks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('calendars_beta', function($table) {
           $table->dropColumn('children');
           $table->dropColumn('master_hash');
           $table->bigInteger('parent_id')->nullable();
           $table->bigInteger('parent_offset')->nullable();
           $table->string('parent_link_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('calendars_beta', function($table) {
            $table->string('children');
            $table->string('master_hash');
            $table->dropColumn('parent_id');
            $table->dropColumn('parent_offset');
            $table->dropColumn('parent_link_date');
        });
    }
}
