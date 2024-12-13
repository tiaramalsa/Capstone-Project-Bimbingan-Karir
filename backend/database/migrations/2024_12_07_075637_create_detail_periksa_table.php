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
        Schema::create('detail_periksa', function (Blueprint $table) {
            $table->id(); // id int primary key auto_increment
            $table->unsignedBigInteger('id_periksa'); // foreign key
            $table->unsignedBigInteger('id_obat'); // foreign key

            $table->foreign('id_periksa')->references('id')->on('periksa')->onDelete('cascade');
            $table->foreign('id_obat')->references('id')->on('obat')->onDelete('cascade');
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_periksa');
    }
};