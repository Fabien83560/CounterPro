<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\DiscordServer;
use App\Models\User;

use Illuminate\Http\Request;

class LeaderboardController extends Controller
{  
    public function index()
    {
        $players = User::orderBy('total_count', 'desc')->take(100)->get();
        $servers = DiscordServer::orderBy('counter_value', 'desc')->take(100)->get();

        return view('/leaderboards', ['players' => $players, 'servers' => $servers]);
    }

    public function server($server_id)
    {
        $server = DiscordServer::find($server_id);
        if (!$server) {
            abort(404, 'Server not found');
        }

        $players = DB::table('user_server_counters')
            ->join('users', 'user_server_counters.user_id', '=', 'users.user_id')
            ->select('users.user_id', 'users.user_name', 'user_server_counters.counter_value')
            ->where('user_server_counters.server_id', $server_id)
            ->orderBy('user_server_counters.counter_value', 'desc')
            ->get();

        return view('/leaderboardServer', ['server' => $server,'players' => $players]);
    }
}
