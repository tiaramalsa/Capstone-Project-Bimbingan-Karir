<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToDaftarPoliTable extends Migration
{
    public function up()
    {
        Schema::table('daftar_poli', function (Blueprint $table) {
            $table->string('status')->default('Belum Di Periksa')->after('no_antrian'); // Default: Belum Di Periksa
        });
    }

    public function down()
    {
        Schema::table('daftar_poli', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
