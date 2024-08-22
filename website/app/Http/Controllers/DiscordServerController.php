<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\DiscordServer;
use Illuminate\Http\Request;

class DiscordServerController extends Controller
{
    public function getRank($server_id)
    {
        $serverTotalCount = DB::table('discord_servers')
            ->where('server_id', $server_id)
            ->value('counter_value');
        
        if ($serverTotalCount === null) {
            return null;
        }
        
        $rank = DB::table('discord_servers')
            ->where('counter_value', '>', $serverTotalCount)
            ->count() + 1;
    
        return $rank;
    }

    public function show($id)
    {
        $discordServer = DiscordServer::find($id);

        if ($discordServer) {
            return response()->json($discordServer);
        } else {
            return response()->json(['message' => 'Record not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'server_id' => 'required|string|max:100',
            'server_name' => 'required|string|max:100',
            'channel_counter_id' => 'nullable|string|max:100',
            'channel_information_id' => 'nullable|string|max:100',
            'channel_leaderboards_id' => 'nullable|string|max:100',
            'counter_value' => 'nullable|integer',
            'last_user_id' => 'nullable|string|max:100',
        ]);

        $discordServer = DiscordServer::create($validated);

        return response()->json($discordServer, 201);
    }
}
