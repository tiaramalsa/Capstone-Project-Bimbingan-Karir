<?php

namespace App\Http\Controllers;

use App\Models\DaftarPoli;
use App\Models\Pasien;
use App\Models\JadwalPeriksa;
use Illuminate\Http\Request;

class DaftarPoliController extends Controller
{
    /**
     * Menampilkan informasi pasien yang login termasuk no rekam medis.
     */
    public function getPasien($id_pasien)
    {
        $pasien = Pasien::find($id_pasien);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan.'], 404);
        }

        return response()->json([
            'id' => $pasien->id,
            'nama' => $pasien->nama,
            'no_rekam_medis' => $pasien->no_rm, 
        ], 200);
    }

    /**
     * Menampilkan daftar jadwal periksa berdasarkan poli yang dipilih.
     */
    public function getJadwalByPoli($id_poli)
    {
        $jadwal = JadwalPeriksa::whereHas('dokter', function ($query) use ($id_poli) {
            $query->where('id_poli', $id_poli);
        })
        ->where('status', 'aktif')
        ->with(['dokter', 'dokter.poli'])
        ->get();

        if ($jadwal->isEmpty()) {
            return response()->json(['message' => 'Tidak ada jadwal periksa untuk poli ini.'], 404);
        }

        return response()->json($jadwal, 200);
    }

    /**
     * Membuat pendaftaran baru.
     */
    public function store(Request $request)
{
    \Log::info('Payload diterima di store:', $request->all());

    try {
     
        $validatedData = $request->validate([
            'id_pasien' => 'required|exists:pasien,id',
            'id_jadwal' => 'required|exists:jadwal_periksa,id',
            'keluhan' => 'required|string',
        ]);

        $validatedData['status'] = $request->input('status', 'Belum Di Periksa');

        $jadwal = JadwalPeriksa::findOrFail($validatedData['id_jadwal']);
        $currentDate = now()->toDateString(); 

        $lastAntrianToday = DaftarPoli::where('id_jadwal', $jadwal->id)
            ->whereDate('created_at', $currentDate)
            ->max('no_antrian');

        $validatedData['no_antrian'] = $lastAntrianToday ? $lastAntrianToday + 1 : 1;

        
        $existingDaftar = DaftarPoli::where('id_pasien', $request->id_pasien)
            ->where('id_jadwal', $request->id_jadwal)
            ->whereDate('created_at', $currentDate)
            ->first();

        if ($existingDaftar) {
            return response()->json([
                'message' => 'Pasien sudah memiliki riwayat pendaftaran pada hari ini.',
                'data' => $existingDaftar,
            ], 200);
        }

        // pendaftaran baru
        $daftarPoli = DaftarPoli::create($validatedData);

        $daftarPoliWithRelations = DaftarPoli::with(['jadwal.dokter.poli', 'pasien'])
            ->find($daftarPoli->id);

        return response()->json($daftarPoliWithRelations, 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('Validasi gagal:', $e->errors());
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        \Log::error('Terjadi kesalahan:', ['message' => $e->getMessage()]);
        return response()->json([
            'message' => 'Terjadi kesalahan.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * Menampilkan riwayat pendaftaran pasien berdasarkan ID.
     */
    public function riwayatPasien($id_pasien)
    {
        try {
            $riwayatPoli = DaftarPoli::where('id_pasien', $id_pasien)
                ->with([
                    'jadwal.dokter.poli', 
                    'jadwal' 
                ])
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'Poli' => optional($item->jadwal->dokter->poli)->nama_poli ?? 'N/A',
                        'Dokter' => optional($item->jadwal->dokter)->nama ?? 'N/A',
                        'Hari' => $item->jadwal->hari ?? 'N/A',
                        'Mulai' => $item->jadwal->jam_mulai ?? 'N/A',
                        'Selesai' => $item->jadwal->jam_selesai ?? 'N/A',
                        'Antrian' => $item->no_antrian,
                        'Status' => $item->status,
                    ];
                });

            if ($riwayatPoli->isEmpty()) {
                return response()->json([]);
            }

            return response()->json($riwayatPoli, 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching riwayat poli:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateNoAntrian($id_jadwal)
{
    $jadwalExists = JadwalPeriksa::find($id_jadwal);

    if (!$jadwalExists) {
        return response()->json(['error' => 'Jadwal tidak ditemukan.'], 404);
    }

    $currentDate = now()->toDateString(); 

    // nomor antrian terakhir pada hari yang sama
    $lastAntrian = DaftarPoli::where('id_jadwal', $id_jadwal)
        ->whereDate('created_at', $currentDate)
        ->max('no_antrian');

    return response()->json(['no_antrian' => $lastAntrian ? $lastAntrian + 1 : 1]);
}


    /**
 * Mengubah status pendaftaran.
 */
public function updateStatus($id, Request $request){
    $validatedData = $request->validate([
        'status' => 'required|in:Sudah Diperiksa,Belum Di Periksa'
    ]);

    $daftarPoli = DaftarPoli::findOrFail($id);
    $daftarPoli->update(['status' => $validatedData['status']]);

    return response()->json([
        'message' => 'Status berhasil diperbarui.',
        'data' => $daftarPoli
    ], 200);
}
}
