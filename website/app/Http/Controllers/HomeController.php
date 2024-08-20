<?php

namespace App\Http\Controllers;

use App\Models\DiscordServer;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(){
        $totalServer = DiscordServer::count();
        $totalUsers = User::count();
        $totalCounterValue = DiscordServer::sum('counter_value');

        return view('welcome', [
            'serverCount' => $totalServer,
            'usersCount' => $totalUsers,
            'totalCounterValue' => $totalCounterValue
        ]);
    }
}
