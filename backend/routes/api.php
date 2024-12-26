<?php
/*
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 
|
*/


use App\Http\Controllers\DokterController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\PoliController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\DashboardAdminController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JadwalPeriksaController;
use App\Http\Controllers\DaftarPoliController;
use App\Http\Controllers\PeriksaController;
use App\Http\Controllers\DetailPeriksaController;
use App\Http\Controllers\RiwayatPasienController;
use Illuminate\Support\Facades\Route;

Route::resource('dokters', DokterController::class)->except(['create', 'edit']);
Route::resource('pasiens', PasienController::class)->except(['create', 'edit']);
Route::resource('polies', PoliController::class)->except(['create', 'edit']);
Route::resource('obaties', ObatController::class)->except(['create', 'edit']);
Route::get('/doctors/count', [DashboardAdminController::class, 'countDokters']);
Route::get('/patients/count', [DashboardAdminController::class, 'countPasiens']);
Route::get('/poli/count', [DashboardAdminController::class, 'countPolies']);
Route::post('/register', [PasienController::class, 'register']);
Route::post('/loginuser', [LoginController::class, 'login']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/jadwal-periksa', [JadwalPeriksaController::class, 'fetchJadwal']); 
Route::get('/jadwal-periksa/{id}', [JadwalPeriksaController::class, 'show']); 
Route::post('/jadwal-periksa', [JadwalPeriksaController::class, 'store']); 
Route::put('/jadwal-periksa/{id}', [JadwalPeriksaController::class, 'update']); 
Route::delete('/jadwal-periksa/{id}', [JadwalPeriksaController::class, 'destroy']); 

Route::get('/pasien/{id}', [PasienController::class, 'getPasien']);
Route::get('/daftar-poli', [DaftarPoliController::class, 'index']);         
Route::get('/daftar-poli/{id}', [DaftarPoliController::class, 'show']);     
Route::post('/daftar-poli', [DaftarPoliController::class, 'store']);       
Route::get('/jadwal-periksa/poli/{id_poli}', [DaftarPoliController::class, 'getJadwalByPoli']); 
Route::get('/riwayatpoli/{id_pasien}', [DaftarPoliController::class, 'riwayatPasien']);
Route::get('/generate-no-antrian/{id_jadwal}', [DaftarPoliController::class, 'generateNoAntrian']);
Route::put('/daftar-poli/{id}/status', [DaftarPoliController::class, 'updateStatus']);

Route::get('/periksa', [PeriksaController::class, 'index']); 
Route::get('/periksa/{id}', [PeriksaController::class, 'show']); 
Route::post('/periksa', [PeriksaController::class, 'store']); 
Route::get('/periksa/dokter/{id_dokter}', [PeriksaController::class, 'index']);
Route::put('/periksa/edit/{id}', [PeriksaController::class, 'update']);

Route::get('/riwayatpasien/riwayat/{id_pasien}', [RiwayatPasienController::class, 'riwayat']);
Route::get('/riwayatpasien/detail/{id_periksa}', [RiwayatPasienController::class, 'detail']);
Route::get('/riwayatpasien/riwayat/dokter/{id_dokter}', [RiwayatPasienController::class, 'riwayatByDokter']);
Route::get('/riwayatpasien/riwayat/detail/${id_dokter}', [RiwayatPasienController::class, 'detailByDokter']);
Route::get('/pasien/{id_pasien}/riwayat/detail/{id_periksa}', [RiwayatPasienController::class, 'detailRiwayatPasien']);
//Riwayat di Pasien
Route::get('/daftar-poli/{id_daftar_poli}/periksa', [RiwayatPasienController::class, 'getPeriksaByDaftarPoli']);

Route::get('detail-periksa', [DetailPeriksaController::class, 'index']); 
Route::post('detail-periksa', [DetailPeriksaController::class, 'store']); 
Route::get('detail-periksa/{id}', [DetailPeriksaController::class, 'show']); 
Route::put('detail-periksa/{id}', [DetailPeriksaController::class, 'update']); 
Route::delete('detail-periksa/{id}', [DetailPeriksaController::class, 'destroy']); 



