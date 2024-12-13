<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dokter;
use App\Models\Pasien;
use App\Models\Poli;

class DashboardAdminController extends Controller
{
    public function countDokters()
    {
        $count = Dokter::count();
        return response()->json(['count' => $count]);
    }

    public function countPasiens()
    {
        $count = Pasien::count();
        return response()->json(['count' => $count]);
    }

    public function countPolies()
    {
        $count = Poli::count();
        return response()->json(['count' => $count]);
    }
}
