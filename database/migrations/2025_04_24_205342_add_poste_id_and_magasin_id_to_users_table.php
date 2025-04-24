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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('poste_id')
                ->nullable()
                ->constrained('postes')
                ->onDelete('cascade');

            $table->foreignId('magasin_id')
                ->nullable()
                ->constrained('magasins')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['poste_id']);
            $table->dropColumn('poste_id');

            $table->dropForeign(['magasin_id']);
            $table->dropColumn('magasin_id');
        });
    }
};
