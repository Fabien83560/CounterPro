@extends('layouts.app')
@section('title', 'User Stats')
@section('content')

<div class="container mx-auto px-4 py-8">
    <section class="relative flex items-center">
        <a href="{{ url('/leaderboards') }}" class="absolute left-0 top-0 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mt-4 mb-6 ml-4 inline-block hidden sm:block">
            Back to Leaderboards
        </a>

        <h2 class="text-3xl font-bold text-center mx-auto">
            User Stats for <u>{{ $user->user_name }}</u>
        </h2>
    </section>

    <!-- Player Leaderboard -->
    <div class="border border-gray-300 bg-gray-900 p-6 rounded-lg mt-8">
        <div class="flex-shrink-0 order-1 sm:order-2 mb-4 sm:mb-0"> <!-- Positionne l'image en haut sur mobile -->
            @if ($avatarUrl)
                <img src="{{ $avatarUrl }}" alt="{{ $user->user_name }}'s Avatar" class="w-32 h-32 rounded-full object-cover relative left-1/2 transform -translate-x-1/2 mb-4" style="border: 2px solid {{ $user->hex }};">
            @endif
        </div>
        <p class="text-xl text-center text-gray-300">Total Count: {{ $user->total_count }}</p>
        <hr class="my-6">
        <h3 class="text-2xl font-semibold mb-4 text-center text-white">Different Servers Counters</h3>
        <hr class="my-6">
        <ul>
            @foreach($serverCounters as $index => $counter)
            <li class="cursor-pointer hover:bg-gray-600 flex items-center m-2 p-2 {{ $index % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700' }} rounded-lg relative">
                <a href="{{ url('/leaderboards/' . $counter->server_id) }}" class="flex items-center w-full">
                    <span class="min-w-[2rem] w-8 h-8 rounded-full flex items-center justify-center mr-4 ml-4 font-bold text-white {{ $index % 2 == 0 ? 'bg-teal-500' : 'bg-blue-500' }} text-base">
                        {{ $index + 1 }}
                    </span>
                    <span class="flex-1 text-white text-left sm:text-center md:text-base whitespace-nowrap">
                        {{ $counter->server_name }} - {{ $counter->counter_value }} count
                    </span>
                </a>
            </li>
            @endforeach
        </ul>
    </div>
</div>

@endsection
