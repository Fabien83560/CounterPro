<?php

namespace App\Http\Controllers;

use App\Models\UserServerCounter;
use Illuminate\Http\Request;

class UserServerCounterController extends Controller
{
    public function show($userId, $serverId)
    {
        $counter = UserServerCounter::where('user_id', $userId)
                                    ->where('server_id', $serverId)
                                    ->first();

        if ($counter) {
            return response()->json($counter);
        } else {
            return response()->json(['message' => 'Record not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|string|max:100',
            'server_id' => 'required|string|max:100',
            'counter_value' => 'required|integer',
        ]);

        $counter = UserServerCounter::create($validated);

        return response()->json($counter, 201);
    }

    public function update(Request $request, $userId, $serverId)
    {
        $validated = $request->validate([
            'counter_value' => 'sometimes|required|integer',
        ]);

        $counter = UserServerCounter::where('user_id', $userId)
                                    ->where('server_id', $serverId)
                                    ->first();

        if ($counter) {
            $counter->update($validated);
            return response()->json($counter);
        } else {
            return response()->json(['message' => 'Record not found'], 404);
        }
    }

    public function destroy($userId, $serverId)
    {
        $counter = UserServerCounter::where('user_id', $userId)
                                    ->where('server_id', $serverId)
                                    ->first();

        if ($counter) {
            $counter->delete();
            return response()->json(['message' => 'Record deleted successfully']);
        } else {
            return response()->json(['message' => 'Record not found'], 404);
        }
    }
}
