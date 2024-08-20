@extends('layouts.app')
@section('title', 'Commands')
@section('content')

<div class="container mx-auto px-4 py-6">
    <section class="mt-12">
        <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 p-2">
                <h2 class="text-2xl font-bold">CounterPro Commands</h2>
                <p class="text-gray-700">Find all CounterProt commands and information you need fast and easy</p>
            </div>
            <!-- Google Ads -->
            <!-- <div class="w-full md:w-1/2 p-2">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4050940490843957" crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style="display:inline-block;width:100%;height:90px"
                    data-ad-client="ca-pub-4050940490843957"
                    data-ad-slot="6770580457"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div> -->
        </div>
        <hr class="my-6">
    </section>
    <div class="mt-4"></div>
    <div class="flex flex-wrap">
        <div class="w-full p-2">
            <input type="text" id="searchInput" class="bg-gray-800 w-full p-2 border border-gray-300 rounded mb-4" placeholder="Search for commands">
            <div class="mt-8"></div>
            <!-- Commands List -->
            <div class="commands-list">
                <!-- Command SETUP -->
                <div class="command-item bg-gray-800 border border-gray-700 rounded-lg mb-4">
                    <button class="command-header bg-gray-700 text-white p-4 w-full text-left rounded-t-lg focus:outline-none">
                        /setup&nbsp; <span class="text-gray-400">- setup bot channels</span>
                    </button>
                    <div class="command-content bg-gray-900 text-gray-300 p-4 rounded-b-lg">
                        <div class="example-section">
                            <span class="text-gray-400"><u>Usage Examples:</u></span> <br/>
                            <span class="examples">
                                <b>/setup</b><br/>
                                After entering the order, follow the instructions in the message that was sent.
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Command HELP -->
                <div class="command-item bg-gray-800 border border-gray-700 rounded-lg mb-4">
                    <button class="command-header bg-gray-700 text-white p-4 w-full text-left rounded-t-lg focus:outline-none">
                        /help&nbsp; <span class="text-gray-400">- display all avalaibles commands</span>
                    </button>
                    <div class="command-content bg-gray-900 text-gray-300 p-4 rounded-b-lg">
                        <div class="example-section">
                            <span class="text-gray-400"><u>Usage Examples:</u></span> <br/>
                            <span class="examples">
                                <b>/help</b><br/>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Command LEADERBOARD -->
                <div class="command-item bg-gray-800 border border-gray-700 rounded-lg mb-4">
                    <button class="command-header bg-gray-700 text-white p-4 w-full text-left rounded-t-lg focus:outline-none">
                        /leaderboard&nbsp; <span class="text-gray-400">- display leaderboard</span>
                    </button>
                    <div class="command-content bg-gray-900 text-gray-300 p-4 rounded-b-lg">
                        <div class="example-section">
                            <span class="text-gray-400"><u>Usage Examples:</u></span> <br/>
                            <span class="examples">
                                <b>/leaderboard option:</b><br/>
                                Different options availables : <br/>
                                <ul class="list-disc ml-5">
                                    <li>all: Displays the leaderboard of all players combined.</li>
                                    <li>servers: Displays the leaderboard of the different servers.</li>
                                    <li>here: Displays the leaderboard on the server where you enter the command.</li>
                                </ul>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Command SUPPORT -->
                <div class="command-item bg-gray-800 border border-gray-700 rounded-lg mb-4">
                    <button class="command-header bg-gray-700 text-white p-4 w-full text-left rounded-t-lg focus:outline-none">
                        /support&nbsp; <span class="text-gray-400">- get support discord server</span>
                    </button>
                    <div class="command-content bg-gray-900 text-gray-300 p-4 rounded-b-lg">
                        <div class="example-section">
                            <span class="text-gray-400"><u>Usage Examples:</u></span> <br/>
                            <span class="examples">
                                <b>/support</b><br/>
                                Join the server sent to you to request help on the support discord.
                            </span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <hr class="my-6">
</div>

@endsection

@section('other')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('searchInput').addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            document.querySelectorAll('.command-item').forEach(item => {
                const commandButton = item.querySelector('.command-header');
                const commandText = commandButton.textContent.toLowerCase();
                if (commandText.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        document.querySelectorAll('.command-header').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    content.style.opacity = 0;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.opacity = 1;
                }
            });
        });
    });
</script>
<style>
    .command-content {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.35s ease, opacity 0.35s ease;
    }

    .command-content.open {
        max-height: 100px;
        opacity: 1;
    }
</style>
@endsection
