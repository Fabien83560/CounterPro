<?php

namespace App\Http\Controllers;
use App\Models\DiscordServer;
use App\Models\User;

use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index()
    {
        $players = User::orderBy('total_count', 'desc')->take(100)->get();
        $servers = DiscordServer::orderBy('counter_value', 'desc')->take(100)->get();

        return view('/leaderboards', ['players' => $players,
                                           'servers' => $servers]);
    }
}
