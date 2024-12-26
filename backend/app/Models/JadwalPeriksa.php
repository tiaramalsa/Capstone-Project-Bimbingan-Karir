<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalPeriksa extends Model
{
    use HasFactory;

    /**
     * Nama tabel database yang digunakan oleh model ini.
     */
    protected $table = 'jadwal_periksa';

    /**
     * Kolom yang bisa diisi secara massal.
     */
    protected $fillable = [
        'id_dokter',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'status', // Tambahan kolom status sesuai validasi controller
    ];

    /**
     * Kolom timestamps otomatis.
     */
    public $timestamps = true;

    /**
     * Relasi ke model Dokter.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function dokter()
    {
        return $this->belongsTo(Dokter::class, 'id_dokter');
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeTidakAktif($query)
    {
        return $query->where('status', 'tidak aktif');
    }

    public function setStatusAttribute($value)
    {
        $allowedStatuses = ['aktif', 'tidak aktif', 'non-aktif'];
        if (!in_array($value, $allowedStatuses)) {
            throw new \InvalidArgumentException('Status harus "aktif", "tidak aktif", atau "non-aktif".');
        }
        $this->attributes['status'] = $value === 'non-aktif' ? 'tidak aktif' : $value;
    }
}
