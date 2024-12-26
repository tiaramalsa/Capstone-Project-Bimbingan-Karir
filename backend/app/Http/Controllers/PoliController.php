<?php

namespace App\Http\Controllers;

use App\Models\Poli;
use Illuminate\Http\Request;

class PoliController extends Controller
{
    public function index()
    {
        return response()->json(Poli::all());
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_poli' => 'required|string|max:25',
            'keterangan' => 'required|string|max:255',
        ]);

        //simpan data poli
        $poli = Poli::create($validated);

        return response()->json(['message' => 'Poli created succesfully', 'data' => $poli], 201);
    }
    public function show(string $id)
    {
        $poli = Poli::find($id);
        
        if(!$poli){
            return response()->json(['message' => 'Poli not found'], 404);
        }

        return response()->json($poli);
    }


    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nama_poli' => 'required|string|max:25',
            'keterangan' => 'required|string|max:255',
        ]);

        $poli = Poli::find($id);

        if (!$poli){
            return response()->json(['message' => 'Poli not found'], 404);
        }

        $poli->update($validated);

        return response()->json(['message' => 'Poli updated succesfully', 'data' => $poli]);
    }

    public function destroy(string $id)
    {
        $poli = Poli::find($id);

        if (!$poli){
            return response()->json(['message' => 'Poli not found', 404]);
        }

        $poli->delete();
        
        return response()->json(['message' => 'Poli deleted succesfully']);
    }
}
