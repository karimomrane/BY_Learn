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
        Schema::create('user_progresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('lesson_id');
            $table->unsignedBigInteger('quiz_id')->nullable(); // Optional if a quiz is associated with the lesson
            $table->integer('score')->default(0);  // Points gained for completing the quiz/lesson
            $table->timestamp('completed_at')->nullable(); // When the lesson or quiz was completed
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->foreign('lesson_id')
                ->references('id')->on('lessons')
                ->onDelete('cascade');

            $table->foreign('quiz_id')
                ->references('id')->on('quizzes')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_progresses');
    }
};
