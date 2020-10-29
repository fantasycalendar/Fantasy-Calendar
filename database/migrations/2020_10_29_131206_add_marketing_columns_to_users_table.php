<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMarketingColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('marketing_opt_in_at')->nullable();
            $table->timestamp('marketing_opt_out_at')->nullable();
            $table->bigInteger('policy_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('marketing_opt_in_at');
            $table->dropColumn('marketing_opt_out_at');
            $table->dropColumn('policy_id');
        });
    }
}
