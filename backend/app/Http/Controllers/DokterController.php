<?php
namespace App\Http\Controllers;

use App\Models\Dokter;
use Illuminate\Http\Request;

class DokterController extends Controller
{
    public function index()
    {
        $dokters = Dokter::with('poli')->get();
        return response()->json($dokters);
    }
    public function create()
    {
        return view('dokter.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:15',
            'id_poli' => 'required|integer',
        ]);

        $dokter = Dokter::create($validatedData);
        return response()->json($dokter, 201);
    }


    public function show($id)
    {
        $dokter = Dokter::with('poli')->find($id);

    if (!$dokter) {
        return response()->json(['message' => 'Dokter not found'], 404);
    }

    return response()->json($dokter);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:15',
            'id_poli' => 'required|integer',
        ]);

        $dokter = Dokter::findOrFail($id);
        $dokter->update($validatedData);

        return response()->json($dokter);
    }

    public function destroy($id)
    {
        $dokter = Dokter::findOrFail($id);
        $dokter->delete();

        return response()->json(['message' => 'Dokter deleted successfully.']);
    }
}
