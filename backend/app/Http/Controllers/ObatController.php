<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    public function index()
    {
        return response()->json(Obat::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_obat' => 'required|string|max:50',
            'kemasan' => 'required|string|max:35',
            'harga' => 'required|integer|min:0',
        ]);

        $obat = Obat::create($validated);

        return response()->json(['message' => 'Obat created succesfully', 'data' => $obat], 201);
    }

    public function show(string $id)
    {
        $obat = Obat::find($id);
        
        if(!$obat){
            return response()->json(['message' => 'Obat not found'], 404);
        }

        return response()->json($obat);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nama_obat' => 'required|string|max:50',
            'kemasan' => 'required|string|max:35',
            'harga' => 'required|integer|min:0',
        ]);

        $obat = Obat::find($id);

        if (!$obat){
            return response()->json(['message' => 'Obat not found'], 404);
        }

        $obat->update($validated);

        return response()->json(['message' => 'Obat updated succesfully', 'data' => $obat]);
    }

    public function destroy(string $id)
    {
        $obat = Obat::find($id);

        if (!$obat){
            return response()->json(['message' => 'Obat not found', 404]);
        }

        $obat->delete();
        
        return response()->json(['message' => 'Obat deleted succesfully']);
    }
}
