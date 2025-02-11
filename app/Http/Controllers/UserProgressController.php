<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Programme;
use App\Models\User_progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserProgressController extends Controller
{
    /**
     * Show the program details with its lessons and questions.
     */
    public function show($programId)
    {
        $program = Programme::with([
            'lessons.quizze.questions.answers' // Load lessons with questions and answers
        ])->findOrFail($programId);
        $userprogress = User_progress::where('user_id', Auth::id())->get();

        return Inertia::render('UserProgress/Program', [
            'program' => $program,
            'userprogress' => $userprogress
        ]);
    }

    /**
     * Store the user's progress after completing the quiz for a lesson.
     */
    public function store(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'score'     => 'required|integer',
            'quiz_id'   => 'required|exists:quizzes,id',
        ]);
        $progress = new User_progress();
        $progress->user_id     = Auth::id();
        $progress->lesson_id   = $request->lesson_id;
        $progress->quiz_id     = $request->quiz_id;
        $progress->score       = $request->score;
        $progress->completed_at = now();
        $progress->save();

        // Return to the program page with a success message
        $userprogress = User_progress::where('user_id', Auth::id())->get();

        return Inertia::render('UserProgress/Program', [
            'message' => 'Progress saved successfully.',
            'userprogress' => $userprogress,
            'program' => Programme::with([
                'lessons.quizze.questions.answers' // Include updated program data
            ])->findOrFail($request->program_id)
        ]);
    }
}
