<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalPeriksa extends Model
{
    use HasFactory;

    protected $table = 'jadwal_periksa';

    protected $fillable = [
        'id_dokter',
        'hari',
        'jam_mulai',
        'jam_selesai',
    ];

    public $timestamps = true;

    /**
     * Relasi ke model Dokter.
     */
    public function dokter()
    {
        return $this->belongsTo(Dokter::class, 'id_dokter');
    }
}
