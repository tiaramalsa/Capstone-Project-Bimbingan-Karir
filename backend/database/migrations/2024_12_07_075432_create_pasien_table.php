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
        Schema::create('pasien', function (Blueprint $table) {
            $table->id(); // id, primary key, auto-increment
            $table->string('nama', 150); // nama, varchar(150), not null
            $table->string('alamat', 255); // alamat, varchar(255), not null
            $table->unsignedBigInteger('no_ktp'); // no_ktp, unsigned int, not null
            $table->unsignedBigInteger('no_hp'); // no_hp, unsigned int, not null
            $table->char('no_rm', 10); // no_rm, char(10), not null
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasien');
    }
};