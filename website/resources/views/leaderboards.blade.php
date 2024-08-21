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
                View Servers Leaderboard
            </button>
            <button id="playerLeaderboardBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg">
                View Player Leaderboard
            </button>
        </div>
        
        <!-- Server Leaderboard (shown by default) -->
        <div id="serverLeaderboard" class="leaderboard-content border border-gray-300 bg-gray-900 p-6 rounded-lg">
            <h3 class="text-2xl font-semibold mb-4 text-white">Servers Leaderboard</h3>
            <ul>
                @foreach($servers as $index => $server)
                <li class="cursor-pointer hover:bg-gray-600 flex items-center m-2 p-2 {{ $index % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700' }} rounded-lg">
                    <a href="{{ url('/leaderboards/server/' . $server->server_id) }}" class="flex items-center w-full">
                        <span class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-white bg-teal-500 text-base ml-4">
                            {{ $index + 1 }}
                        </span>
                        <span class="flex-1 text-white">{{ $server->server_name }} - {{ $server->counter_value }} count</span>
                    </a>
                </li>
                @endforeach
            </ul>
        </div>

        <!-- Player Leaderboard (hidden by default) -->
        <div id="playerLeaderboard" class="leaderboard-content hidden border border-gray-300 bg-gray-900 p-6 rounded-lg">
            <h3 class="text-2xl font-semibold mb-4 text-white">Player Leaderboard</h3>
            <ul>
                @foreach($players as $index => $player)
                <li class="cursor-pointer hover:bg-gray-600 flex items-center m-2 p-2 {{ $index % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700' }} rounded-lg">
                    <a href="{{ url('/stats/' . $player->user_id) }}" class="flex items-center w-full">
                        <span class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-white bg-blue-500 text-base ml-4">
                            {{ $index + 1 }}
                        </span>
                        <span class="flex-1 text-white">{{ $player->user_name }} - {{ $player->total_count }} count</span>
                    </a>
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
    .hover\:bg-gray-600:hover {
        background-color: #4a5568; /* Dark gray color */
    }
</style>
@endsection