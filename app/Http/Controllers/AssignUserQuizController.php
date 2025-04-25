<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Quizze;
use App\Models\AssignUserQuiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignUserQuizController extends Controller
{
    public function index()
    {
        $quizzes = Quizze::with('lesson')->get();
        
        return Inertia::render('UserQuiz/AffectedUserQuiz', [
            'quizzes' => $quizzes,
            'initialQuiz' => request('quizId') ? Quizze::find(request('quizId')) : null
        ]);
    }

    public function getUsersData($quizId)
    {
        $quiz = Quizze::findOrFail($quizId);

        $assignedUserIds = AssignUserQuiz::where('quizze_id', $quizId)->pluck('user_id');
        $unassignedUserIds = User::whereNotIn('id', $assignedUserIds)->get();


        return response()->json([
            'assignedUsers' => User::whereIn('id', $assignedUserIds)->get(),
            'unassignedUsers' => User::whereNotIn('id', $assignedUserIds)->get(),
            'quiz' => $quiz
        ]);
    }

    public function assignUsers(Request $request, $quizId)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        foreach ($request->user_ids as $userId) {
            AssignUserQuiz::firstOrCreate([
                'user_id' => $userId,
                'quizze_id' => $quizId,
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function unassignUsers(Request $request, $quizId)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        AssignUserQuiz::where('quizze_id', $quizId)
            ->whereIn('user_id', $request->user_ids)
            ->delete();

        return response()->json(['success' => true]);
    }
}