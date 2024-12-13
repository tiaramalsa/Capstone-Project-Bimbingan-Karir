<?php

namespace App\Http\Controllers;

use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PasienController extends Controller
{
    public function index()
    {
        return response()->json(Pasien::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_ktp' => 'required|string|max:16|unique:pasien,no_ktp',
            'no_hp' => 'required|string|max:15|unique:pasien,no_hp',
            'no_rm' => 'required|string|size:10|unique:pasien,no_rm', // Admin input manual
        ]);

        // Simpan data pasien
        $pasien = Pasien::create($validatedData);

        return response()->json([
            'message' => 'Pasien berhasil ditambahkan',
            'pasien' => $pasien,
        ], 201);
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_ktp' => 'required|string|max:16|unique:pasien,no_ktp',
            'no_hp' => 'required|string|max:15|unique:pasien,no_hp',
            'password' => 'required|string|min:8', 
        ]);

        $currentYearMonth = now()->format('Ym'); 
        $lastPasien = Pasien::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastPasien ? (int)substr($lastPasien->no_rm, -3) + 1 : 1;
        $generatedNoRM = now()->format('Y') . now()->format('m') . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Hashing password
        $hashedPassword = Hash::make($validatedData['password']);

        $pasien = Pasien::create([
            'nama' => $validatedData['nama'],
            'alamat' => $validatedData['alamat'],
            'no_ktp' => $validatedData['no_ktp'],
            'no_hp' => $validatedData['no_hp'],
            'password' => $hashedPassword,
            'no_rm' => $generatedNoRM,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'pasien' => $pasien,
        ], 201);
    }

    public function show($id)
    {
        $pasien = Pasien::find($id);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
        }

        return response()->json($pasien);
    }

    public function update(Request $request, $id)
    {

        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_ktp' => 'required|string|max:16|unique:pasien,no_ktp,' . $id,
            'no_hp' => 'required|string|max:15|unique:pasien,no_hp,' . $id,
            'no_rm' => 'required|string|size:10|unique:pasien,no_rm,' . $id,
            'password' => 'nullable|string|min:8',
        ]);

        $pasien = Pasien::find($id);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
        }

        // Hash password jika diubah
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }
        
        $pasien->update($validatedData);

        return response()->json([
            'message' => 'Data pasien berhasil diperbarui',
            'pasien' => $pasien,
        ]);
    }

    public function destroy($id)
    {
        $pasien = Pasien::find($id);

        if (!$pasien) {
            return response()->json(['message' => 'Pasien tidak ditemukan'], 404);
        }

        $pasien->delete();

        return response()->json(['message' => 'Pasien berhasil dihapus']);
    }
}