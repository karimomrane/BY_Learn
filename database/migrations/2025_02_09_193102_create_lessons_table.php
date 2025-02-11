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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('programme_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_path');       // Stores the video file path or URL
            $table->string('image_path')->nullable();  // Stores the image file path or URL
            $table->timestamps();

            // Foreign key constraint to programmes table
            $table->foreign('programme_id')
                  ->references('id')->on('programmes')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
