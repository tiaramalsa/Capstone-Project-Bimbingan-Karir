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
        Schema::create('jadwal_periksa', function (Blueprint $table) {
            $table->id(); // id, primary key, auto-increment
            $table->unsignedBigInteger('id_dokter'); // foreign key ke tabel dokter
            $table->string('hari', 10); // hari, varchar(10), not null
            $table->time('jam_mulai'); // jam_mulai, time, not null
            $table->time('jam_selesai'); // jam_selesai, time, not null
            $table->foreign('id_dokter')->references('id')->on('dokter')->onDelete('cascade'); // hubungan ke dokter.id
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_periksa');
    }
};