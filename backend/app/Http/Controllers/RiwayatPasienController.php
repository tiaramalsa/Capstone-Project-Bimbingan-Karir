<?php

namespace App\Http\Controllers;

use App\Models\Periksa;
use Illuminate\Http\Request;

class RiwayatPasienController extends Controller
{
    public function riwayat($id_pasien)
    {
        \Log::info("Memproses riwayat pasien dengan ID:", ['id_pasien' => $id_pasien]);

        try {
            $riwayat = Periksa::with(['daftarPoli.pasien', 'detailPeriksa.obat'])
                ->whereHas('daftarPoli', function ($query) use ($id_pasien) {
                    $query->where('id_pasien', $id_pasien);
                })
                ->get()
                ->map(function ($item) {
                    return [
                        'id_periksa' => $item->id, 
                        'id_pasien' => $item->daftarPoli->id_pasien, 
                        'Poli' => $item->daftarPoli->jadwal->dokter->poli->nama_poli ?? 'Tidak Ditemukan',
                        'Dokter' => $item->daftarPoli->jadwal->dokter->nama ?? 'Tidak Ditemukan',
                        'Hari' => $item->daftarPoli->jadwal->hari ?? 'Tidak Ditemukan',
                        'Mulai' => $item->daftarPoli->jadwal->jam_mulai ?? 'Tidak Ditemukan',
                        'Selesai' => $item->daftarPoli->jadwal->jam_selesai ?? 'Tidak Ditemukan',
                        'Antrian' => $item->daftarPoli->no_antrian,
                        'Status' => $item->status ?? 'Belum Diperiksa',
                    ];
                });

            if ($riwayat->isEmpty()) {
                \Log::warning('Tidak ada data riwayat ditemukan untuk ID pasien:', ['id_pasien' => $id_pasien]);
                return response()->json(['message' => 'Tidak ada data riwayat ditemukan.'], 404);
            }
            \Log::info("Data riwayat yang ditemukan:", $riwayat->toArray());

            return response()->json($riwayat, 200);
        } catch (\Exception $e) {
            \Log::error('Error pada pengambilan riwayat:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function detail($id_periksa)
    {
        \Log::info("ID Periksa yang Diterima:", ['id_periksa' => $id_periksa]);

        try {
            $periksa = Periksa::with([
                'daftarPoli.jadwal.dokter.poli',
                'daftarPoli.pasien',
                'detailPeriksa.obat'
            ])
            ->findOrFail($id_periksa);

            $result = [
                'nama_pasien' => $periksa->daftarPoli->pasien->nama ?? 'Tidak Ditemukan',
                'alamat' => $periksa->daftarPoli->pasien->alamat ?? 'Tidak Ditemukan',
                'no_ktp' => $periksa->daftarPoli->pasien->no_ktp ?? 'Tidak Ditemukan',
                'no_hp' => $periksa->daftarPoli->pasien->no_hp ?? 'Tidak Ditemukan',
                'no_rm' => $periksa->daftarPoli->pasien->no_rm ?? 'Tidak Ditemukan',
                'tgl_periksa' => $periksa->tgl_periksa,
                'no_antrian' => $periksa->daftarPoli->no_antrian,
                'catatan' => $periksa->catatan,
                'nama_poli' => $periksa->daftarPoli->jadwal->dokter->poli->nama_poli ?? 'Tidak Ditemukan',
                'nama_dokter' => $periksa->daftarPoli->jadwal->dokter->nama ?? 'Tidak Ditemukan',
                'hari' => $periksa->daftarPoli->jadwal->hari ?? 'Tidak Ditemukan',
                'jam_mulai' => $periksa->daftarPoli->jadwal->jam_mulai ?? 'Tidak Ditemukan',
                'jam_selesai' => $periksa->daftarPoli->jadwal->jam_selesai ?? 'Tidak Ditemukan',
                'obat' => $periksa->detailPeriksa->map(function ($detail) {
                    return [
                        'nama_obat' => $detail->obat->nama_obat,
                        'harga' => $detail->obat->harga,
                    ];
                }),
                'biaya_periksa' => $periksa->biaya_periksa,
            ];
             
            \Log::info("Detail fetched successfully", $result);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan pada server.', 'error' => $e->getMessage()], 500);
        }
    }

    public function riwayatByDokter($id_dokter)
    {
        try {
            $riwayat = Periksa::with([
                'daftarPoli.pasien',
                'daftarPoli.jadwal.dokter',
                'detailPeriksa.obat'
            ])
            ->whereHas('daftarPoli.jadwal', function ($query) use ($id_dokter) {
                $query->where('id_dokter', $id_dokter);
            })
            ->get();

            // Kembalikan data pasien dengan kolom yang relevan
            $dataPasien = $riwayat->map(function ($item) {
                return [
                    'id_periksa' => $item->id,
                    'nama' => $item->daftarPoli->pasien->nama ?? null,
                    'alamat' => $item->daftarPoli->pasien->alamat ?? null,
                    'no_ktp' => $item->daftarPoli->pasien->no_ktp ?? null,
                    'no_hp' => $item->daftarPoli->pasien->no_hp ?? null,
                    'no_rm' => $item->daftarPoli->pasien->no_rm ?? null,
                ];
            });

            if ($dataPasien->isEmpty()) {
                return response()->json(['message' => 'Tidak ada data pasien ditemukan.'], 404);
            }

            return response()->json($dataPasien, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan pada server.', 'error' => $e->getMessage()], 500);
        }
    }


    public function detailRiwayatByDokter(Request $request)
    {
        try {
            // ID dokter yang login
            $idDokter = $request->user()->id; 

            // riwayat pemeriksaan berdasarkan ID dokter
            $riwayat = Periksa::with([
                'daftarPoli.jadwal.dokter',
                'daftarPoli.jadwal.dokter.poli',
                'daftarPoli.pasien',
                'detailPeriksa.obat'
            ])
            ->whereHas('daftarPoli.jadwal', function ($query) use ($id_dokter) {
                $query->where('id_dokter', $id_dokter);
            })
            ->get()
            ->map(function ($periksa) {
                return [
                    'nama_poli' => $periksa->daftarPoli->jadwal->dokter->poli->nama_poli ?? 'Tidak Ditemukan',
                    'nama_dokter' => $periksa->daftarPoli->jadwal->dokter->nama ?? 'Tidak Ditemukan',
                    'hari' => $periksa->daftarPoli->jadwal->hari ?? 'Tidak Ditemukan',
                    'jam_mulai' => $periksa->daftarPoli->jadwal->jam_mulai ?? 'Tidak Ditemukan',
                    'jam_selesai' => $periksa->daftarPoli->jadwal->jam_selesai ?? 'Tidak Ditemukan',
                    'no_antrian' => $periksa->daftarPoli->no_antrian,
                    'tgl_periksa' => $periksa->tgl_periksa,
                    'catatan' => $periksa->catatan ?? 'Tidak Ada Catatan',
                    'obat' => $periksa->detailPeriksa->map(function ($detail) {
                        return $detail->obat->nama_obat ?? 'Tidak Ditemukan';
                    }),
                    'total_biaya' => $periksa->biaya_periksa,
                ];
            });

            if ($riwayat->isEmpty()) {
                return response()->json(['message' => 'Tidak ada riwayat pasien untuk dokter ini.'], 404);
            }

            return response()->json(['riwayat' => $riwayat], 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching riwayat pasien:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function detailByDokter($id_dokter)
    {
        try {
            $periksa = Periksa::with(['daftarPoli.jadwal.dokter', 'daftarPoli.pasien', 'detailPeriksa.obat'])
                ->whereHas('daftarPoli.jadwal', function ($query) use ($id_dokter) {
                    $query->where('id_dokter', $id_dokter);
                })
                ->get();
    
            if ($periksa->isEmpty()) {
                return response()->json(['message' => 'Tidak ada riwayat pasien untuk dokter ini.'], 404);
            }
    
            $result = $periksa->map(function ($item) {
                return [
                    'nama_poli' => $item->daftarPoli->jadwal->dokter->poli->nama_poli ?? 'Tidak Ditemukan',
                    'nama_dokter' => $item->daftarPoli->jadwal->dokter->nama ?? 'Tidak Ditemukan',
                    'hari' => $item->daftarPoli->jadwal->hari ?? 'Tidak Ditemukan',
                    'jam_mulai' => $item->daftarPoli->jadwal->jam_mulai ?? 'Tidak Ditemukan',
                    'jam_selesai' => $item->daftarPoli->jadwal->jam_selesai ?? 'Tidak Ditemukan',
                    'no_antrian' => $item->daftarPoli->no_antrian,
                    'tgl_periksa' => $item->tgl_periksa,
                    'catatan' => $item->catatan ?? 'Tidak Ada Catatan',
                    'obat' => $item->detailPeriksa->map(function ($detail) {
                        return [
                            'nama_obat' => $detail->obat->nama_obat,
                            'harga' => $detail->obat->harga,
                        ];
                    }),
                    'total_biaya' => $item->biaya_periksa,
                ];
            });
    
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan pada server.', 'error' => $e->getMessage()], 500);
        }
    }

    public function detailRiwayatPasien($id_pasien, $id_periksa)
    {
        \Log::info("Parameter diterima:", ['id_pasien' => $id_pasien, 'id_periksa' => $id_periksa]);

        try {
            // Validasi: Pastikan ID pasien yang login cocok dengan ID pasien di data pemeriksaan
            $periksa = Periksa::with([
                'daftarPoli.jadwal.dokter.poli',
                'daftarPoli.pasien',
                'detailPeriksa.obat'
            ])
            ->whereHas('daftarPoli', function ($query) use ($id_pasien) {
                $query->where('id_pasien', $id_pasien);
            })
            ->where('id', $id_periksa) // Cocokkan dengan ID periksa
            ->first();

            // Jika tidak ditemukan, kembalikan error
            if (!$periksa) {
                \Log::warning("Data tidak ditemukan untuk pasien atau periksa:", ['id_pasien' => $id_pasien, 'id_periksa' => $id_periksa]);
                return response()->json(['message' => 'Data tidak ditemukan atau Anda tidak memiliki akses.'], 404);
            }

            // Siapkan data respons
            $result = [
                'nama_pasien' => $periksa->daftarPoli->pasien->nama ?? 'Tidak Ditemukan',
                'alamat' => $periksa->daftarPoli->pasien->alamat ?? 'Tidak Ditemukan',
                'no_ktp' => $periksa->daftarPoli->pasien->no_ktp ?? 'Tidak Ditemukan',
                'no_hp' => $periksa->daftarPoli->pasien->no_hp ?? 'Tidak Ditemukan',
                'no_rm' => $periksa->daftarPoli->pasien->no_rm ?? 'Tidak Ditemukan',
                'tgl_periksa' => $periksa->tgl_periksa,
                'no_antrian' => $periksa->daftarPoli->no_antrian,
                'catatan' => $periksa->catatan,
                'nama_poli' => $periksa->daftarPoli->jadwal->dokter->poli->nama_poli ?? 'Tidak Ditemukan',
                'nama_dokter' => $periksa->daftarPoli->jadwal->dokter->nama ?? 'Tidak Ditemukan',
                'hari' => $periksa->daftarPoli->jadwal->hari ?? 'Tidak Ditemukan',
                'jam_mulai' => $periksa->daftarPoli->jadwal->jam_mulai ?? 'Tidak Ditemukan',
                'jam_selesai' => $periksa->daftarPoli->jadwal->jam_selesai ?? 'Tidak Ditemukan',
                'obat' => $periksa->detailPeriksa->map(function ($detail) {
                    return [
                        'nama_obat' => $detail->obat->nama_obat,
                        'harga' => $detail->obat->harga,
                    ];
                }),
                'biaya_periksa' => $periksa->biaya_periksa,
            ];

            \Log::info("Data detail periksa:", $periksa->toArray());
            return response()->json($result, 200);

        } catch (\Exception $e) {
            \Log::error("Terjadi kesalahan saat mengambil detail riwayat pasien:", [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json(['message' => 'Terjadi kesalahan pada server.', 'error' => $e->getMessage()], 500);
        }
    }
    public function getPeriksaByDaftarPoli($id_daftar_poli)
    {
        \Log::info("Mencari Periksa berdasarkan ID Daftar Poli:", ['id_daftar_poli' => $id_daftar_poli]);
    
        try {
            $periksa = Periksa::where('id_daftar_poli', $id_daftar_poli)->first();
    
            if (!$periksa) {
                \Log::warning("Data tidak ditemukan untuk ID Daftar Poli:", ['id_daftar_poli' => $id_daftar_poli]);
                return response()->json(['message' => 'Data tidak ditemukan.'], 404);
            }
    
            return response()->json([
                'id_periksa' => $periksa->id,
            ], 200);
        } catch (\Exception $e) {
            \Log::error("Terjadi kesalahan saat mencari ID Periksa:", [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);
    
            return response()->json(['message' => 'Terjadi kesalahan pada server.'], 500);
        }
    }
    
}