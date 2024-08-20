@extends('layouts.app')
@section('title', 'Home')
@section('content')
<section class="bg-gray-800 py-4">
    <div class="container mx-auto px-4 flex flex-col md:flex-row items-center md:gap-x-32">
        <div class="md:w-1/2 text-center md:text-left">
            <h1 class="text-4xl font-bold text-teal-400">CounterPro</h1>
            <p class="mt-4" style="text-indent: 1.5em;">
                <b>CounterPro</b> is a Discord bot designed for managing and monitoring <b>counting channels.</b> 
                It provides features to create <b>counting channels</b> where members can count numbers sequentially from 1. 
                Additionally, <b>CounterPro</b> offers detailed <b>leaderboards</b>, allowing you to track performance in the <b>server</b>, 
                <b>inter-server</b>, or <b>all players</b> stats. With <b>CounterPro</b>, communities can organize counting competitions, 
                view leaderboards, and engage members in a fun and interactive way.
            </p>
            <div class="mt-6 flex flex-col sm:flex-row gap-4 sm:justify-center">
                <a href="https://discord.com/oauth2/authorize?client_id=1271798827682107475" class="bg-teal-400 text-gray-900 px-6 py-2 rounded-md hover:bg-teal-300">Invite Bot</a>
                <a href="https://discord.gg/u6w8HuzzgX" class="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600">Support Server</a>
            </div>
        </div>

        <div class="md:w-1/2 flex flex-col justify-center items-center mt-6">
            <div class="rounded-3xl overflow-hidden">
                <img class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:w-80" src="{{ asset('img/logo.png') }}" alt="CounterPro-logo">
            </div>
            <p class="mt-4 text-gray-400 text-center">Bot active since August 2024</p>
        </div>
    </div>
</section>


<!-- Features -->
<section id="Features" class="py-16">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-10">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-gray-800 p-6 rounded-md text-center">
                <div class="text-5xl mb-4 text-teal-400">
                    <i class="bi bi-clock-history"></i>
                </div>
                <h4 class="text-xl font-semibold mb-2">Easy to Use</h4>
                <p>With CounterPro, your moderators will no longer need to check if users are counting correctly. This will save you time.</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-md text-center">
                <div class="text-5xl mb-4 text-teal-400">
                    <i class="bi bi-trophy-fill"></i>
                </div>
                <h4 class="text-xl font-semibold mb-2">Competition</h4>
                <p>You will be able to compare yourself with all the other servers to show who is the best.</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-md text-center">
                <div class="text-5xl mb-4 text-teal-400">
                    <i class="bi bi-folder2-open"></i>
                </div>
                <h4 class="text-xl font-semibold mb-2">Open Source</h4>
                <p>CounterPro is an Open Source bot, meaning anyone can contribute to it. This also makes it more secure.</p>
            </div>
        </div>
    </div>
</section>

<!-- Statics -->
<section id="Statics" class="bg-gray-800 py-16">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-10">Statistics</h2>
        <div class="flex flex-col md:flex-row justify-center items-center">
            <div class="md:w-1/3 mb-8 md:mb-0">
                <img src="{{ asset('img/statics.png') }}" alt="Statics" class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            </div>
            <div class="flex flex-col md:flex-row justify-around w-full md:w-2/3 text-center">
                <div class="p-6">
                    <div class="text-5xl text-teal-400">
                        <i class="bi bi-hdd-stack text-primary"></i>
                    </div>
                    <h5 class="text-xl font-semibold mt-4">{{ $serverCount }}</h5>
                    <p>Servers</p>
                </div>
                <div class="p-6">
                    <div class="text-5xl text-teal-400">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <h5 class="text-xl font-semibold mt-4">{{ $usersCount }}</h5>
                    <p>Users</p>
                </div>
                <div class="p-6">
                    <div class="text-5xl text-teal-400">
                        <i class="bi bi-bar-chart"></i>
                    </div>
                    <h5 class="text-xl font-semibold mt-4">{{ $totalCounterValue }}</h5>
                    <p>Total Counting</p>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
