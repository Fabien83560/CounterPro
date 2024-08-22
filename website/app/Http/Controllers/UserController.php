<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

class UserController extends Controller
{  
    public function stats($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            abort(404, 'User not found');
        }
        $user->rank = $this->getRank($user_id);
        
        $avatarUrl = $this->getDiscordAvatarUrl($user_id);
    
        $serverCounters = DB::table('user_server_counters')
            ->join('discord_servers', 'user_server_counters.server_id', '=', 'discord_servers.server_id')
            ->select('user_server_counters.server_id', 'discord_servers.server_name', 'user_server_counters.counter_value')
            ->where('user_server_counters.user_id', $user_id)
            ->orderBy('user_server_counters.counter_value', 'desc')
            ->get();

        $userServerCounterController = new UserServerCounterController();

        foreach ($serverCounters as $serverCounter) {
            $serverCounter->rank = $userServerCounterController->getRank($serverCounter->server_id, $user_id);
        }
        
        return view('statsUser', [
            'user' => $user,
            'serverCounters' => $serverCounters,
            'avatarUrl' => $avatarUrl
        ]);
    }

    private function getDiscordAvatarUrl($user_id)
    {
        $token = env('DISCORD_BOT_TOKEN');
        $url = "https://discord.com/api/v10/users/{$user_id}";
        
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bot ' . $token,
            ])->get($url);
    
            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['avatar']) && $data['avatar']) {
                    $avatarHash = $data['avatar'];
                    return "https://cdn.discordapp.com/avatars/{$user_id}/{$avatarHash}.png";
                } else {
                    $discriminator = $data['discriminator'] ?? '0000';
                    $defaultAvatarIndex = intval($discriminator) % 5;
                    return "https://cdn.discordapp.com/embed/avatars/{$defaultAvatarIndex}.png";
                }
            } else {
                \Log::error('Discord API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers(),
                ]);
            }
    
        } catch (\Exception $e) {
            \Log::error('Failed to fetch Discord avatar URL: ' . $e->getMessage());
        }
    
        $defaultAvatarIndex = intval($user_id) % 5;
        return "https://cdn.discordapp.com/embed/avatars/{$defaultAvatarIndex}.png";
    }  
    
    public function getRank($user_id)
    {
        $userTotalCount = DB::table('users')
            ->where('user_id', $user_id)
            ->value('total_count');
        
        if ($userTotalCount === null) {
            return null;
        }
        
        $rank = DB::table('users')
            ->where('total_count', '>', $userTotalCount)
            ->count() + 1;
    
        return $rank;
    }

    public function show($id)
    {
        $user = User::find($id);

        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|string|max:100',
            'user_name' => 'required|string|max:100',
            'hex' => 'required|string|max:7',
            'total_count' => 'nullable|integer'
        ]);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_name' => 'sometimes|required|string|max:100',
            'hex' => 'sometimes|required|string|max:7',
            'total_count' => 'sometimes|nullable|integer'
        ]);

        $user = User::find($id);

        if ($user) {
            $user->update($validated);
            return response()->json($user);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}
