<?php

namespace App\Http\Controllers;

use App\Models\Periksa;
use App\Models\DaftarPoli;
use App\Models\DetailPeriksa;
use App\Models\Obat;
use Illuminate\Http\Request;

class PeriksaController extends Controller
{
    /**
     * Menampilkan daftar periksa pasien untuk dokter.
     */
    public function index(Request $request, $id_dokter)
    {
        try {
           
            $filterTanggal = $request->query('tanggal');

            $daftarPoliQuery = DaftarPoli::with('pasien')
                ->whereHas('jadwal', fn($query) => $query->where('id_dokter', $id_dokter))
                ->orderBy('no_antrian', 'asc');

            if ($filterTanggal) {
                $daftarPoliQuery->whereDate('created_at', $filterTanggal);
            }

            $daftarPoli = $daftarPoliQuery->get();

            $result = $daftarPoli->map(function ($poli) {
                return [
                    'id' => $poli->id,
                    'no_antrian' => $poli->no_antrian,
                    'nama_pasien' => $poli->pasien->nama ?? 'Tidak Ada',
                    'keluhan' => $poli->keluhan,
                    'status' => $poli->status === 'Sudah Diperiksa' ? 'Sudah Diperiksa' : 'Belum Diperiksa',
                    'created_at' => $poli->created_at->toDateString(), 
                ];
            });

            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan.', 'error' => $e->getMessage()], 500);
        }
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_daftar_poli' => 'required|exists:daftar_poli,id',
            'tgl_periksa' => 'required|date',
            'catatan' => 'nullable|string',
            'biaya_periksa' => 'required|numeric',
            'obat' => 'nullable|array',
            'obat.*' => 'exists:obat,id',
        ]);
    
        $periksa = Periksa::create([
            'id_daftar_poli' => $validatedData['id_daftar_poli'],
            'tgl_periksa' => $validatedData['tgl_periksa'],
            'catatan' => $validatedData['catatan'] ?? '',
            'biaya_periksa' => $validatedData['biaya_periksa'],
        ]);
    
        if (!empty($validatedData['obat'])) {
            foreach ($validatedData['obat'] as $idObat) {
                DetailPeriksa::create([
                    'id_periksa' => $periksa->id,
                    'id_obat' => $idObat,
                ]);
            }
        }
    
        return response()->json(['message' => 'Pemeriksaan berhasil disimpan.'], 201);
    }

    public function show($id)
{
    try {
        $daftarPoli = DaftarPoli::with('pasien')->findOrFail($id);
        $periksa = Periksa::where('id_daftar_poli', $id)
            ->with('detailPeriksa.obat')
            ->first();

        return response()->json([
            'nama_pasien' => $daftarPoli->pasien->nama ?? 'Tidak ditemukan',
            'keluhan' => $daftarPoli->keluhan ?? 'Tidak ada keluhan',
            'tgl_periksa' => $periksa->tgl_periksa ?? null,
            'catatan' => $periksa->catatan ?? '',
            'biaya_periksa' => $periksa->biaya_periksa ?? 150000,
            'obat' => $periksa ? $periksa->detailPeriksa->map(function ($detail) {
                return [
                    'id' => $detail->obat->id,
                    'nama_obat' => $detail->obat->nama_obat,
                    'harga' => $detail->obat->harga,
                ];
            }) : [],
            'obat_list' => Obat::all(['id', 'nama_obat', 'harga']),
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Terjadi kesalahan.', 'error' => $e->getMessage()], 500);
    }
}

public function update(Request $request, $id)
{
    $periksa = Periksa::where('id_daftar_poli', $id)->first();
    if (!$periksa) {
        return response()->json(['message' => "Data periksa dengan ID $id tidak ditemukan."], 404);
    }

    $validatedData = $request->validate([
        'tgl_periksa' => 'nullable|date_format:Y-m-d H:i',
        'catatan' => 'nullable|string',
        'biaya_periksa' => 'nullable|numeric',
        'obat' => 'nullable|array',
        'obat.*' => 'exists:obat,id',
    ]);

    // Jika tgl_periksa tidak lengkap, gunakan nilai lama
    if (!isset($validatedData['tgl_periksa'])) {
        $validatedData['tgl_periksa'] = $periksa->tgl_periksa;
    }

    // Update data
    $periksa->update($validatedData);

    // Logika update obat (jika ada)
    if (isset($validatedData['obat'])) {
        $existingObatIds = $periksa->detailPeriksa->pluck('id_obat')->toArray();
        $newObatIds = $validatedData['obat'];

        $toDelete = array_diff($existingObatIds, $newObatIds);
        DetailPeriksa::whereIn('id_obat', $toDelete)->where('id_periksa', $periksa->id)->delete();

        $toAdd = array_diff($newObatIds, $existingObatIds);
        foreach ($toAdd as $idObat) {
            DetailPeriksa::create([
                'id_periksa' => $periksa->id,
                'id_obat' => $idObat,
            ]);
        }
    }

    return response()->json(['message' => 'Pemeriksaan berhasil diperbarui.'], 200);
}

}
