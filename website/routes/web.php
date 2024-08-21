<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaderboardController;

Route::get('/', [HomeController::class, 'index']);

Route::get('/commands', function () { return view('commands'); });
Route::get('/leaderboards', [LeaderboardController::class, 'index']);
/*Route::get('/stats/{user_id}', [UserController::class, '@@@@']);*/
Route::get('/leaderboards/{server_id}', [LeaderboardController::class, 'server']);

Route::get('/privacy-policy', function () { return view('privacy-policy'); });

Route::get('/terms-of-service', function () { return view('/terms-of-service'); });
