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
        // Add indexes to user_progresses table
        Schema::table('user_progresses', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('lesson_id');
            $table->index('quiz_id');
            $table->index('created_at');
        });

        // Add indexes to assign_user_quiz table
        Schema::table('assign_user_quiz', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('quizze_id');
        });

        // Add indexes to lessons table
        Schema::table('lessons', function (Blueprint $table) {
            $table->index('programme_id');
        });

        // Add indexes to quizzes table
        Schema::table('quizzes', function (Blueprint $table) {
            $table->index('lesson_id');
        });

        // Add indexes to questions table
        Schema::table('questions', function (Blueprint $table) {
            $table->index('quizze_id');
        });

        // Add indexes to answers table
        Schema::table('answers', function (Blueprint $table) {
            $table->index('question_id');
            $table->index('is_correct');
        });

        // Add indexes to users table for filtering
        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
            $table->index('poste_id');
            $table->index('magasin_id');
        });

        // Add indexes to programmes table for date range queries
        Schema::table('programmes', function (Blueprint $table) {
            $table->index('date_debut');
            $table->index('date_fin');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_progresses', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['lesson_id']);
            $table->dropIndex(['quiz_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('assign_user_quiz', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['quizze_id']);
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropIndex(['programme_id']);
        });

        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropIndex(['lesson_id']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropIndex(['quizze_id']);
        });

        Schema::table('answers', function (Blueprint $table) {
            $table->dropIndex(['question_id']);
            $table->dropIndex(['is_correct']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['poste_id']);
            $table->dropIndex(['magasin_id']);
        });

        Schema::table('programmes', function (Blueprint $table) {
            $table->dropIndex(['date_debut']);
            $table->dropIndex(['date_fin']);
            $table->dropIndex(['created_at']);
        });
    }
};
