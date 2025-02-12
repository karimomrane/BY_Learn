<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Program;
use App\Models\Programme;
use App\Models\Question;
use App\Models\User;
use App\Models\User_progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserProgressController extends Controller
{
    public function index()
    {
        $userprogress = User_progress::with('lesson', 'quizze', 'user')->get();

        return Inertia::render('Historique', [
            'userprogress' => $userprogress
        ]);
    }

    public function dashboard()
    {
        $totalusers = User::count();
        $useractif = User::has('user_progress')->count();
        $programmes = Programme::count();
        $lessons = Lesson::count();
        $tentatives = User_progress::count();
        $pointsemis = User_progress::sum('score');
        $totalpoints = Question::count() * 10;
        $lasttentatives = User_progress::with('user')->latest()->take(5)->get();
        $classementbyuser = User_progress::with('user')->selectRaw('user_id, sum(score) as total_score')
            ->groupBy('user_id')
            ->orderByDesc('total_score')
            ->get();
        return Inertia::render('Dashboard', [
            'totalusers' => $totalusers,
            'useractif' => $useractif,
            'programmes' => $programmes,
            'lessons' => $lessons,
            'tentatives' => $tentatives,
            'pointsemis' => $pointsemis,
            'totalpoints' => $totalpoints,
            'lasttentatives' => $lasttentatives,
            'classementbyuser' => $classementbyuser
        ]);
    }
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

        return redirect()->back();
    }

    public function destroy($id)
    {
        $progress = User_progress::findOrFail($id);
        $progress->delete();
        return redirect()->back();
    }
}
