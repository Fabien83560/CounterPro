@extends('layouts.app')
@section('title', 'Leaderboards')
@section('content')

<div class="container mx-auto px-4 py-8">
    <section class="mt-8 text-center">
        <h2 class="text-3xl font-bold mb-6">CounterPro Leaderboards</h2>
        <p class="text-gray-600 mb-8">Select a leaderboard to view the rankings.</p>

        <!-- Leaderboards Buttons -->
        <div class="flex justify-center space-x-4 mb-8">
            <button id="serverLeaderboardBtn" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg">
                View Server Leaderboard
            </button>
            <button id="playerLeaderboardBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg">
                View Player Leaderboard
            </button>
        </div>
        
        <!-- Server Leaderboard (shown by default) -->
        <div id="serverLeaderboard" class="leaderboard-content border border-gray-300 bg-gray-900 p-6 rounded-lg">
            <h3 class="text-2xl font-semibold mb-4 text-white">Server Leaderboard</h3>
            <ul>
                @foreach($servers as $index => $server)
                <li class="flex items-center m-2 {{ $index % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700' }} p-2 rounded-lg">
                    <div class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-6 font-bold text-white bg-teal-500 text-base">{{ $index + 1 }}</div>
                    {{ $server->server_name }} - {{ $server->counter_value }} count
                </li>
                @endforeach
            </ul>
        </div>

        <!-- Player Leaderboard (hidden by default) -->
        <div id="playerLeaderboard" class="leaderboard-content hidden border border-gray-300 bg-gray-900 p-6 rounded-lg">
            <h3 class="text-2xl font-semibold mb-4 text-white">Player Leaderboard</h3>
            <ul>
                @foreach($players as $index => $player)
                @php
                    // Calculate avatar URL or use default if avatar_url is empty
                    $avatarUrl = !empty($player->avatar_url) ? $player->avatar_url : 'https://cdn.discordapp.com/embed/avatars/' . (intval(substr($player->user_id, 0, 1)) % 5) . '.png';
                @endphp
                <li class="flex items-center m-2 {{ $index % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700' }} p-2 rounded-lg">
                    <div class="flex items-center">
                        <div class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-6 font-bold text-white bg-blue-500 text-base">{{ $index + 1 }}</div>
                        <img src="{{ $avatarUrl }}" alt="{{ $player->user_name }}'s avatar" class="w-10 h-10 rounded-full">
                    </div>
                    <div class="ml-4 flex-1">
                        {{ $player->user_name }} - {{ $player->total_count }} count
                    </div>
                </li>
                @endforeach
            </ul>
        </div>

    </section>
</div>

@endsection

@section('other')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const serverBtn = document.getElementById('serverLeaderboardBtn');
        const playerBtn = document.getElementById('playerLeaderboardBtn');
        const serverLeaderboard = document.getElementById('serverLeaderboard');
        const playerLeaderboard = document.getElementById('playerLeaderboard');

        // Show Server Leaderboard by default
        serverLeaderboard.classList.remove('hidden');
        playerLeaderboard.classList.add('hidden');

        // Handle Server Leaderboard Button Click
        serverBtn.addEventListener('click', () => {
            serverLeaderboard.classList.remove('hidden');
            playerLeaderboard.classList.add('hidden');
        });

        // Handle Player Leaderboard Button Click
        playerBtn.addEventListener('click', () => {
            playerLeaderboard.classList.remove('hidden');
            serverLeaderboard.classList.add('hidden');
        });
    });
</script>

<style>
    .hidden {
        display: none;
    }
</style>
@endsection
