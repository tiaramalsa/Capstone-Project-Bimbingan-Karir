<?php

namespace App\Http\Controllers;

use App\Models\JadwalPeriksa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Pastikan menggunakan Log facade

class JadwalPeriksaController extends Controller
{
    public function index()
    {
        $jadwalPeriksa = JadwalPeriksa::all();
        return response()->json($jadwalPeriksa);
    }

    public function show($id)
    {
        $jadwal = JadwalPeriksa::find($id);

        if (!$jadwal) {
            return response()->json(['message' => 'Jadwal tidak ditemukan'], 404);
        }

        return response()->json($jadwal);
    }

    public function store(Request $request)
{
    Log::info('Data yang diterima untuk tambah jadwal:', $request->all());

    $validatedData = $request->validate([
        'id_dokter' => 'required|exists:dokter,id', 
        'hari' => 'required|string',
        'jam_mulai' => 'required|date_format:H:i',
        'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        'status' => 'required|string|in:aktif,tidak aktif,non-aktif',
    ]);

    try {
        //cek jadwal pada hari yang sama
        $existingJadwal = JadwalPeriksa::where('id_dokter', $validatedData['id_dokter'])
        ->where('hari', $validatedData['hari'])
        ->exists();

        if ($existingJadwal){
            return response()->json(['error' => 'Dokter sudah memiliki jadwal di hari tersebut'], 400);
        }

        if ($validatedData['status'] === 'aktif') {
            // Nonaktifkan jadwal lain dengan status aktif
            JadwalPeriksa::where('id_dokter', $validatedData['id_dokter'])
                ->where('status', 'aktif')
                ->update(['status' => 'tidak aktif']);
        }
        $jadwal = JadwalPeriksa::create($validatedData);
        return response()->json($jadwal, 201); 
    } catch (\Exception $e) {
        Log::error('Gagal menambahkan jadwal periksa:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json(['error' => 'Terjadi kesalahan saat menyimpan data.'], 500);
    }
}

    public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'hari' => 'sometimes|required|string',
        'jam_mulai' => 'sometimes|required|date_format:H:i',
        'jam_selesai' => 'sometimes|required|date_format:H:i|after:jam_mulai',
        'status' => 'sometimes|required|string|in:aktif,tidak aktif,non-aktif',
    ]);

    $jadwalPeriksa = JadwalPeriksa::find($id);

    if (!$jadwalPeriksa) {
        return response()->json(['error' => 'Jadwal tidak ditemukan'], 404);
    }

    if ($jadwalPeriksa->status !== 'aktif' && $request->status === 'aktif') {
        JadwalPeriksa::where('id_dokter', $jadwalPeriksa->id_dokter)
            ->where('id', '!=', $id)
            ->update(['status' => 'tidak aktif']);
    }
    $jadwalPeriksa->update($validatedData);

    return response()->json([
        'message' => 'Jadwal berhasil diperbarui.',
        'jadwal' => $jadwalPeriksa,
    ]);
}
    // Menghapus jadwal periksa
    public function destroy($id)
    {
        $jadwal = JadwalPeriksa::find($id);

        if (!$jadwal) {
            return response()->json(['message' => 'Jadwal tidak ditemukan'], 404);
        }

        $jadwal->delete();
        return response()->json(['message' => 'Jadwal berhasil dihapus']);
    }

    public function fetchJadwal(Request $request)
    {
        $id_dokter = $request->query('id_dokter'); // Mendapatkan id_dokter dari parameter query string
        
        // Filter jadwal berdasarkan id_dokter
        $jadwalPeriksa = JadwalPeriksa::where('id_dokter', $id_dokter)->get();

        // Kembalikan data dalam format JSON
        return response()->json($jadwalPeriksa);
    }
}