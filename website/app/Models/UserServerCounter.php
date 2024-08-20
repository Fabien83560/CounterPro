<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserServerCounter extends Model
{
    use HasFactory;

    protected $table = 'user_server_counters';
    protected $fillable = [
        'user_id',
        'server_id',
        'counter_value'
    ];
    protected $primaryKey = ['user_id', 'server_id'];
    public $incrementing = false;
    protected $keyType = 'string';
    protected $dates = [];
    protected $hidden = [];
    protected $casts = [
        'counter_value' => 'integer',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function discordServer()
    {
        return $this->belongsTo(DiscordServer::class, 'server_id');
    }
}
