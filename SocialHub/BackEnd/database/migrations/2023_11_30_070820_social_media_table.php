<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('social_media', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // TWITTER, LINKEDIN, REDDIT
        $table->string('access_token', 5000);
        $table->string('user_name');
        $table->boolean('is_authenticated')->default(true); //TRUE - FALSE
        $table->string('signature')->nullable();
        $table->unsignedBigInteger('user_id');
        $table->foreign('user_id')->references('id')->on('users');
        $table->unique(array('name', 'user_id'));
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
