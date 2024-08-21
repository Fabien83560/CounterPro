<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\DiscordServer;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class LeaderboardController extends Controller
{  
    public function index()
    {
        $players = User::orderBy('total_count', 'desc')->get();
        $servers = DiscordServer::orderBy('counter_value', 'desc')->get();

        return view('/leaderboards', ['players' => $players, 'servers' => $servers]);
    }

    public function server($server_id)
    {
        $server = DiscordServer::find($server_id);
        if (!$server) {
            abort(404, 'Server not found');
        }

        $discordServerController =  new DiscordServerController();
        $server->rank = $discordServerController->getRank($server_id);

        $avatarUrl = $this->getDiscordServerAvatarUrl($server_id);

        $players = DB::table('user_server_counters')
            ->join('users', 'user_server_counters.user_id', '=', 'users.user_id')
            ->select('users.user_id', 'users.user_name', 'user_server_counters.counter_value')
            ->where('user_server_counters.server_id', $server_id)
            ->orderBy('user_server_counters.counter_value', 'desc')
            ->get();

        return view('/leaderboardServer', ['server' => $server,'players' => $players, 'avatarUrl' => $avatarUrl]);
    }

    private function getDiscordServerAvatarUrl($server_id)
    {
        $token = env('DISCORD_BOT_TOKEN');
        $url = "https://discord.com/api/v10/guilds/{$server_id}";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bot ' . $token,
            ])->get($url);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['icon']) && $data['icon']) {
                    $iconHash = $data['icon'];
                    return "https://cdn.discordapp.com/icons/{$server_id}/{$iconHash}.png";
                } else {
                    return "https://cdn.discordapp.com/embed/avatars/0.png";
                }
            } else {
                \Log::error('Discord API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers(),
                ]);
            }

        } catch (\Exception $e) {
            \Log::error('Failed to fetch Discord server avatar URL: ' . $e->getMessage());
        }

        return "https://cdn.discordapp.com/embed/avatars/0.png";
    }

}
