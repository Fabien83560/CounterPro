<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
    
    protected $table = 'users';
    protected $fillable = [
        'user_id',
        'user_name',
        'hex',
        'total_count',
        'avatar_url'
    ];
    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $keyType = 'string';
    protected $dates = [];
    protected $hidden = [];
    protected $casts = [
        'total_count' => 'integer',
    ];
}
