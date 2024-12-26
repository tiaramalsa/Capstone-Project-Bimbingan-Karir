<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DetailPeriksa;
use App\Models\Periksa;
use App\Models\Obat;

class DetailPeriksaController extends Controller
{
   
    public function index()
    {
        $details = DetailPeriksa::with(['periksa', 'obat'])->get(); 
        return response()->json($details);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_periksa' => 'required|exists:periksa,id',
            'id_obat' => 'required|exists:obat,id',
        ]);

        $detail = DetailPeriksa::create($validatedData);

        return response()->json([
            'message' => 'Data berhasil disimpan',
            'data' => $detail,
        ], 201);
    }

    public function show($id)
    {
        $detail = DetailPeriksa::with(['periksa', 'obat'])->find($id);

        if (!$detail) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($detail);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'id_periksa' => 'sometimes|required|exists:periksa,id',
            'id_obat' => 'sometimes|required|exists:obat,id',
        ]);

        $detail = DetailPeriksa::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $detail->update($validatedData);

        return response()->json([
            'message' => 'Data berhasil diperbarui',
            'data' => $detail,
        ]);
    }

    // Hapus data
    public function destroy($id)
    {
        $detail = DetailPeriksa::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $detail->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}
