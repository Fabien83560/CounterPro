<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - CounterPro</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</head>

<body class="bg-gray-900 text-white">

    <!-- Navbar -->
    <nav class="bg-gray-800">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <a href="{{ url('/') }}" class="text-teal-400 text-2xl font-bold hidden md:block">CounterPro</a>
            <button id="nav-toggle" class="text-white focus:outline-none md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div id="nav-menu" class="hidden md:flex space-x-6">
                <a href="{{ url('/') }}#Features" class="hover:text-teal-400">Features</a>
                <a href="{{ url('/') }}#Statics" class="hover:text-teal-400">Statistics</a>
                <a href="{{ url('/commands') }}" class="hover:text-teal-400">Commands</a>
                <a href="{{ url('/leaderboards') }}" class="hover:text-teal-400">Leaderboards</a>
                <div class="relative group">
                    <button class="inline-flex items-center hover:text-teal-400 focus:outline-none">
                        Links
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="absolute bg-gray-800 text-gray-400 py-2 mt-2 w-48 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10">
                        <a href="https://discord.com/oauth2/authorize?client_id=1271798827682107475" class="block px-4 py-2 hover:bg-gray-700 hover:text-white">Invite</a>
                        <a href="https://github.com/Fabien83560/CounterPro" class="block px-4 py-2 hover:bg-gray-700 hover:text-white">Github</a>
                        <a href="https://discord.gg/u6w8HuzzgX" class="block px-4 py-2 hover:bg-gray-700 hover:text-white">Support Server</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Custom Mobile Side Menu -->
        <div class="md:hidden">
            <div class="fixed top-0 left-0 z-50 w-screen h-screen bg-gray-800 opacity-90" id="overlay" style="display: none;"></div>
            <nav id="custom-mobile-menu" class="fixed top-0 left-0 z-50 w-64 bg-gray-900 h-full transform -translate-x-full transition-transform duration-300 ease-in-out">
                <div class="px-6 py-4">
                    <div class="flex justify-between items-center">
                        <a href="{{ url('/') }}" class="text-teal-400 text-2xl font-bold">CounterPro</a>
                        <button id="close-menu" class="text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <ul class="mt-8 space-y-6" id="mobile-nav-links">
                        <li><a href="{{ url('/') }}#Features" class="text-gray-300 text-xl hover:text-teal-400">Features</a></li>
                        <li><a href="{{ url('/') }}#Statics" class="text-gray-300 text-xl hover:text-teal-400">Statistics</a></li>
                        <li><a href="{{ url('/commands') }}" class="text-gray-300 text-xl hover:text-teal-400">Commands</a></li>
                        <li><a href="{{ url('/leaderboards') }}" class="text-gray-300 text-xl hover:text-teal-400">Leaderboards</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                <div class="mb-4 md:mb-0">
                    <h3 class="text-lg font-semibold mb-4">Quick access</h3>
                    <ul class="space-y-2">
                        <li><a href="{{ url('/') }}#Features" class="hover:text-teal-400">Features</a></li>
                        <li><a href="{{ url('/') }}#Statistics" class="hover:text-teal-400">Statistics</a></li>
                        <li><a href="{{ url('/commands') }}" class="hover:text-teal-400">Commands</a></li>
                        <li><a href="{{ url('/leaderboards') }}" class="hover:text-teal-400">Leaderboards</a></li>
                    </ul>
                </div>
                <div class="mb-4 md:mb-0">
                    <h3 class="text-lg font-semibold mb-4">About</h3>
                    <ul class="space-y-2">
                        <li><a href="{{ url('/privacy-policy') }}" class="hover:text-teal-400">Privacy Policy</a></li>
                        <li><a href="{{ url('/terms-of-service') }}" class="hover:text-teal-400">Terms of Service</a></li>
                    </ul>
                </div>
                <div class="mb-4 md:mb-0">
                    <h3 class="text-lg font-semibold mb-4">Links</h3>
                    <ul class="space-y-2">
                        <li><a href="https://discord.gg/u6w8HuzzgX" class="hover:text-teal-400">Support server</a></li>
                        <li><a href="https://discord.com/oauth2/authorize?client_id=1271798827682107475" class="hover:text-teal-400">Invite bot</a></li>
                        <li><a href="https://github.com/Fabien83560/CounterPro" class="hover:text-teal-400">Github</a></li>
                    </ul>
                </div>
                <div class="flex flex-col items-center md:items-start">
                    <div class="flex space-x-4 mb-4">
                        <a href="https://discord.gg/u6w8HuzzgX" class="hover:text-teal-400">
                            <ion-icon name="logo-discord"></ion-icon>
                        </a>
                        <a href="https://github.com/Fabien83560/CounterPro" class="hover:text-teal-400">
                            <ion-icon name="logo-github"></ion-icon>
                        </a>
                    </div>
                    <p class="text-gray-400">CounterPro © 2024</p>
                </div>
            </div>
            <div class="text-center text-gray-600 mt-8">
                Made by <a href="https://github.com/Fabien83560/" class="hover:text-teal-400">ORTEGA Fabien</a> © 2024 Copyright
            </div>
        </div>
    </footer>

    <script>
        // Toggle mobile menu visibility
        const navToggle = document.getElementById('nav-toggle');
        const customMobileMenu = document.getElementById('custom-mobile-menu');
        const overlay = document.getElementById('overlay');
        const closeMenu = document.getElementById('close-menu');
        const mobileNavLinks = document.getElementById('mobile-nav-links');

        navToggle.addEventListener('click', () => {
            customMobileMenu.classList.toggle('-translate-x-full');
            overlay.style.display = overlay.style.display === 'none' || overlay.style.display === '' ? 'block' : 'none';
        });

        closeMenu.addEventListener('click', () => {
            customMobileMenu.classList.add('-translate-x-full');
            overlay.style.display = 'none';
        });

        overlay.addEventListener('click', () => {
            customMobileMenu.classList.add('-translate-x-full');
            overlay.style.display = 'none';
        });

        // Close menu when clicking on a link
        mobileNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                customMobileMenu.classList.add('-translate-x-full');
                overlay.style.display = 'none';
            });
        });
    </script>
    @yield('other')
</body>

</html>
