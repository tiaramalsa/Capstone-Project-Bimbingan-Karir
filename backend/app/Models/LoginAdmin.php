<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginAdmin extends Model
{
    use HasFactory;

    protected $table = 'admin';
    
    protected $fillable = ['username', 'password'];

    protected $hidden = ['password'];
}
