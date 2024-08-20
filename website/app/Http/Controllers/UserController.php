<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
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
            'total_count' => 'nullable|integer',
        ]);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_name' => 'sometimes|required|string|max:100',
            'hex' => 'sometimes|required|string|max:7',
            'total_count' => 'sometimes|nullable|integer',
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
