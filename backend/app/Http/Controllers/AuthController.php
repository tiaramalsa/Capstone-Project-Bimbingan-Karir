<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\LoginAdmin;
use App\Models\Dokter;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'role' => 'required|string|in:admin,dokter',
            'username_or_name' => 'required|string',
            'password_or_no_hp' => 'required|string',
        ]);

        $role = $validatedData['role'];
        $usernameOrName = $validatedData['username_or_name'];
        $passwordOrNoHp = $validatedData['password_or_no_hp'];

        if ($role === 'admin') {
            // Login Admin
            $admin = LoginAdmin::where('username', $usernameOrName)->first();

            if ($admin && Hash::check($passwordOrNoHp, $admin->password)) {
                return response()->json([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $admin->id,
                        'username' => $admin->username,
                    ],
                    'role' => 'admin',
                ], 200);
            }

        } elseif ($role === 'dokter') {
            // Login Dokter
            $dokter = Dokter::where('nama', $usernameOrName)
                ->where('no_hp', $passwordOrNoHp)
                ->first();

            if ($dokter) {
                return response()->json([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $dokter->id,
                        'nama' => $dokter->nama,
                        'no_hp' => $dokter->no_hp,
                    ],
                    'role' => 'dokter',
                ], 200);
            }
        }

        // login gagal?
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }
}