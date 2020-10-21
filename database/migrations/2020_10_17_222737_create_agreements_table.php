<?php

use App\Agreement;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgreementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agreements', function (Blueprint $table) {
            $table->id();
            $table->longText('content');
            $table->timestamps();
            $table->timestamp('in_effect_at')->nullable();
        });

        Agreement::create([
            'content' => Storage::disk('base')->get('public/policies/Terms of Service.md'),
            'in_effect_at' => now()
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agreements');
    }
}
