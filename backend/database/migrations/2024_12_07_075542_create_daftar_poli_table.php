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
        Schema::create('daftar_poli', function (Blueprint $table) {
            $table->id(); // id, primary key, auto-increment
            $table->unsignedBigInteger('id_pasien'); // foreign key ke tabel pasien
            $table->unsignedBigInteger('id_jadwal'); // foreign key ke tabel jadwal_periksa
            $table->text('keluhan'); // keluhan, text, not null
            $table->integer('no_antrian')->nullable(); // no_antrian, integer, nullable
            $table->foreign('id_pasien')->references('id')->on('pasien')->onDelete('cascade'); // relasi ke pasien.id
            $table->foreign('id_jadwal')->references('id')->on('jadwal_periksa')->onDelete('cascade'); // relasi ke jadwal_periksa.id
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daftar_poli');
    }
};