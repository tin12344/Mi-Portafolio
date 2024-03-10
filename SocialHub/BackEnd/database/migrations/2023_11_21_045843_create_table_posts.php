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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('post');
            $table->string('type'); //Instant, Scheduled
            $table->string('status');// Pending, Published
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('schedule_post_id')->nullable()->constrained('schedule_posts');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_posts');
    }
};
