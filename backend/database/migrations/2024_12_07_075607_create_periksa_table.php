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
        Schema::create('periksa', function (Blueprint $table) {
            $table->id(); // id int primary key auto_increment
            $table->unsignedBigInteger('id_daftar_poli'); // foreign key
            $table->date('tgl_periksa'); // tgl_periksa date not null
            $table->text('catatan'); // catatan text not null
            $table->integer('biaya_periksa')->nullable(); // biaya_periksa int, nullable

            $table->foreign('id_daftar_poli')->references('id')->on('daftar_poli')->onDelete('cascade');
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periksa');
    }
};