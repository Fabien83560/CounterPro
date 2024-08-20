<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscordServer extends Model
{
    use HasFactory;

    protected $table = 'discord_servers';
    protected $fillable = [
        'server_id',
        'server_name',
        'channel_counter_id',
        'channel_information_id',
        'channel_leaderboards_id',
        'counter_value',
        'last_user_id'
    ];
    protected $primaryKey = 'server_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $dates = [];
    protected $hidden = [];
    protected $casts = [
        'counter_value' => 'integer',
    ];
    public function lastUser()
    {
        return $this->belongsTo(User::class, 'last_user_id');
    }
}
