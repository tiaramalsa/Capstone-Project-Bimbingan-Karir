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
        Schema::create('dokter', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('nama', 150)->nullable(false); // VARCHAR(150) NOT NULL
            $table->string('alamat', 255)->nullable(); // VARCHAR(255)
            $table->unsignedBigInteger('no_hp')->nullable(false); // Unsigned INT NOT NULL
            $table->unsignedBigInteger('id_poli')->nullable(false); // Foreign key reference
            
            // Foreign key constraint
            $table->foreign('id_poli')->references('id')->on('poli')->onDelete('cascade');
            
            $table->timestamps(); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokter');
    }
};