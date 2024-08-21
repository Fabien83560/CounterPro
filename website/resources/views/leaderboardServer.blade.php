@extends('layouts.app')
@section('title', 'Server Leaderboard')
@section('content')

<div class="container mx-auto px-4 py-8">
    <section class="relative flex items-center">
        <!-- Back to Leaderboards Button -->
        <a href="{{ url('/leaderboards') }}" class="absolute left-0 top-0 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mt-4 mb-6 ml-4 inline-block hidden sm:block">
            Back to Leaderboards
        </a>

        <!-- Title -->
        <h2 class="text-3xl font-bold text-center mx-auto">
            Server Leaderboard
        </h2>
    </section>

    <!-- Player Leaderboard -->
    <div class="border border-gray-300 bg-gray-900 p-6 rounded-lg mt-8">
        <h3 class="text-2xl font-semibold mb-4 text-center text-white">
            Players Rankings for server <u>{{ $server->server_name }}</u>
        </h3>
        <p class="text-xl text-center text-gray-300">Counter: {{ $server->counter_value }}</p>
        <hr class="my-6">
        <ul>
            @foreach($players as $index => $player)
            <li class="cursor-pointer hover:bg-gray-600 flex items-center m-2 p-2 {{ $index % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700' }} rounded-lg relative">
                <a href="{{ url('/stats/' . $player->user_id) }}" class="flex items-center w-full">
                    <span class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-4 ml-4 font-bold text-white {{ $index % 2 == 0 ? 'bg-teal-500' : 'bg-blue-500' }} text-base">
                        {{ $index + 1 }}
                    </span>
                    <span class="flex-1 text-white text-left sm:text-center sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 md:text-base whitespace-nowrap">
                        {{ $player->user_name }} - {{ $player->counter_value }} count
                    </span>
                </a>
            </li>
            @endforeach
        </ul>
    </div>
</div>

@endsection
